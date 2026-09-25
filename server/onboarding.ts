// Server-side onboarding drafts and submissions.
// The browser receives only an HttpOnly continuation cookie. Application payloads
// are encrypted before they are written to PostgreSQL and are never logged.

import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { query } from './db.ts';

const APPLICATION_TYPES = ['merchant', 'courier', 'host'] as const;
type ApplicationType = (typeof APPLICATION_TYPES)[number];

interface StoredApplication {
  id: string;
  status: 'draft' | 'submitted';
  payload_version: number;
  payload_ciphertext: Buffer;
  updated_at: Date | string;
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asApplicationType(value: string): ApplicationType | null {
  return APPLICATION_TYPES.includes(value as ApplicationType) ? value as ApplicationType : null;
}

function tokenCookieName(type: ApplicationType): string {
  return `nexg_onboard_${type}`;
}

function tokenCookiePath(type: ApplicationType): string {
  return `/api/onboarding/${type}`;
}

function readToken(req: Request, type: ApplicationType): string | null {
  const name = `${tokenCookieName(type)}=`;
  const cookies = String(req.headers.cookie ?? '').split(';');
  for (const item of cookies) {
    const value = item.trim();
    if (value.startsWith(name)) {
      const token = value.slice(name.length);
      return /^[A-Za-z0-9_-]{40,60}$/.test(token) ? token : null;
    }
  }
  return null;
}

function writeTokenCookie(req: Request, res: Response, type: ApplicationType, token: string): void {
  const attributes = [
    `${tokenCookieName(type)}=${token}`,
    `Path=${tokenCookiePath(type)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=2592000',
  ];
  if (req.secure || process.env.NODE_ENV === 'production') attributes.push('Secure');
  res.append('Set-Cookie', attributes.join('; '));
}

function clearTokenCookie(req: Request, res: Response, type: ApplicationType): void {
  const attributes = [
    `${tokenCookieName(type)}=`,
    `Path=${tokenCookiePath(type)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (req.secure || process.env.NODE_ENV === 'production') attributes.push('Secure');
  res.append('Set-Cookie', attributes.join('; '));
}

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function encryptionKey(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET is not configured');
  return createHmac('sha256', secret).update('nexg-onboarding-payload-v1').digest();
}

function encryptPayload(payload: Record<string, unknown>): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

function decryptPayload(value: Buffer): Record<string, unknown> {
  if (value.length < 29) throw new Error('Invalid encrypted onboarding payload');
  const iv = value.subarray(0, 12);
  const tag = value.subarray(12, 28);
  const ciphertext = value.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  const payload = JSON.parse(plaintext);
  if (!isRecord(payload)) throw new Error('Invalid onboarding payload');
  return payload;
}

function sameOrigin(req: Request): boolean {
  const source = req.get('origin') || req.get('referer');
  if (!source) return false;
  try {
    const requestOrigin = `${req.protocol}://${req.get('host')}`.toLowerCase();
    return new URL(source).origin.toLowerCase() === requestOrigin;
  } catch {
    return false;
  }
}

function readPayload(req: Request): { version: number; data: Record<string, any> } | null {
  const body = req.body;
  if (!isRecord(body) || !isRecord(body.data)) return null;
  const version = Number.isInteger(body.version) ? Number(body.version) : 1;
  if (version < 1 || version > 20) return null;
  const serialized = JSON.stringify(body.data);
  if (Buffer.byteLength(serialized, 'utf8') > 240 * 1024) return null;
  return { version, data: body.data };
}

function hasText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function submissionIssues(type: ApplicationType, data: Record<string, any>): string[] {
  const issues: string[] = [];
  const requireText = (value: unknown, label: string) => {
    if (!hasText(value)) issues.push(`${label} is required.`);
  };

  if (type === 'merchant') {
    const profile = isRecord(data.profileData) ? data.profileData : {};
    const contact = isRecord(data.contactData) ? data.contactData : {};
    requireText(data.selectedCategoryId, 'Business category');
    if (!Array.isArray(data.selectedSubcategoryIds) || data.selectedSubcategoryIds.length === 0) {
      issues.push('At least one business type is required.');
    }
    requireText(profile.legalName, 'Legal business name');
    requireText(profile.tradingName, 'Trading name');
    requireText(profile.kraPin, 'KRA PIN');
    if (!Array.isArray(data.branches) || data.branches.length === 0 || data.branches.some((branch: any) =>
      !isRecord(branch) || !hasText(branch.name) || !hasText(branch.city) || !hasText(branch.address))) {
      issues.push('Every branch needs a name, city, and address.');
    }
    requireText(contact.fullName, 'Primary contact name');
    requireText(contact.email, 'Primary contact email');
    requireText(contact.phone, 'Primary contact phone');
    if (data.deliveryNexg !== true && data.deliveryOwn !== true) issues.push('A delivery option is required.');
    requireAgreement(data, issues);
  } else if (type === 'courier') {
    const form = isRecord(data.formData) ? data.formData : {};
    if (!['independent', 'dedicated', 'fleet'].includes(String(data.selectedType))) {
      issues.push('A courier pathway is required.');
    }
    if (data.selectedType === 'fleet') {
      for (const [key, label] of [
        ['flName', 'Company name'], ['flKraPIN', 'Company KRA PIN'], ['flRegNum', 'Registration number'],
        ['flAddress', 'Company address'], ['flContactName', 'Contact name'], ['flContactPhone', 'Contact phone'],
        ['flContactEmail', 'Contact email'],
      ]) requireText(form[key], label);
    } else {
      for (const [key, label] of [
        ['fullName', 'Full name'], ['dob', 'Date of birth'], ['phone', 'Phone'], ['county', 'County'],
        ['address', 'Address'], ['idNum', 'ID or passport number'], ['kraPin', 'KRA PIN'],
        ['dlNum', 'Driving licence number'], ['dlExpiry', 'Driving licence expiry'],
        ['emergName', 'Emergency contact name'], ['emergRel', 'Emergency contact relationship'],
        ['emergPhone', 'Emergency contact phone'], ['signatoryName', 'Signatory name'],
      ]) requireText(form[key], label);
      if (data.selectedType === 'independent') requireText(form.plateNum, 'Vehicle registration number');
    }
    requireAgreement(data, issues);
  } else {
    const form = isRecord(data.form) ? data.form : {};
    const chips = isRecord(data.chips) ? data.chips : {};
    for (const [key, label] of [
      ['contactName', 'Contact name'], ['contactPhone', 'Contact phone'], ['contactEmail', 'Contact email'],
      ['propertyName', 'Property name'], ['legalEntity', 'Legal entity'], ['propertyType', 'Property type'],
      ['address', 'Property address'], ['neighbourhood', 'Neighbourhood'], ['city', 'City'],
      ['signatoryName', 'Signatory name'],
    ]) requireText(form[key], label);
    if (!Array.isArray(chips.services) || chips.services.length === 0) issues.push('At least one guest service is required.');
    if (form.termsAccepted !== true) issues.push('Agreement acceptance is required.');
    requireSignature(data, issues);
  }

  return issues;
}

function requireAgreement(data: Record<string, any>, issues: string[]): void {
  if (data.termsAccepted !== true) issues.push('Agreement acceptance is required.');
  requireSignature(data, issues);
}

function requireSignature(data: Record<string, any>, issues: string[]): void {
  if (!hasText(data.signatoryName)) issues.push('Signatory name is required.');
  if (data.sigMode !== 'draw' && data.sigMode !== 'type') issues.push('Signature method is required.');
  if (data.sigMode === 'draw' && !hasText(data.signatureImage) && !hasText(data.signature)) {
    issues.push('A drawn signature is required.');
  }
}

async function pruneExpiredDrafts(): Promise<void> {
  await query(
    "DELETE FROM onboarding_applications WHERE status = 'draft' AND expires_at <= NOW()",
    [],
    'onboarding.prune'
  );
}

async function getDraft(type: ApplicationType, hash: string): Promise<StoredApplication | null> {
  const rows = await query<StoredApplication>(
    `SELECT id, status, payload_version, payload_ciphertext, updated_at
       FROM onboarding_applications
      WHERE application_type = $1 AND token_hash = $2 AND status = 'draft' AND expires_at > NOW()
      LIMIT 1`,
    [type, hash],
    'onboarding.draft.read'
  );
  return rows[0] ?? null;
}

export function registerOnboardingRoutes(app: any): void {
  app.get('/api/onboarding/:type/draft', async (req: Request, res: Response) => {
    const type = asApplicationType(req.params.type);
    if (!type) return res.status(404).json({ error: 'Unknown onboarding type' });
    res.setHeader('Cache-Control', 'no-store');
    try {
      await pruneExpiredDrafts();
      const token = readToken(req, type);
      if (!token) return res.json({ draft: null });
      const row = await getDraft(type, tokenHash(token));
      if (!row) {
        clearTokenCookie(req, res, type);
        return res.json({ draft: null });
      }
      return res.json({
        draft: {
          version: row.payload_version,
          savedAt: new Date(row.updated_at).toISOString(),
          data: decryptPayload(row.payload_ciphertext),
        },
      });
    } catch (err: any) {
      console.error('[NEXG] onboarding draft read failed');
      return res.status(503).json({ error: 'Unable to load saved application' });
    }
  });

  app.put('/api/onboarding/:type/draft', async (req: Request, res: Response) => {
    const type = asApplicationType(req.params.type);
    if (!type) return res.status(404).json({ error: 'Unknown onboarding type' });
    if (!sameOrigin(req)) return res.status(403).json({ error: 'Request origin rejected' });
    const payload = readPayload(req);
    if (!payload) return res.status(400).json({ error: 'A valid application draft is required' });
    res.setHeader('Cache-Control', 'no-store');
    try {
      await pruneExpiredDrafts();
      let token = readToken(req, type) ?? randomBytes(32).toString('base64url');
      const saved = await query<{ id: string }>(
        `INSERT INTO onboarding_applications
           (application_type, token_hash, status, payload_version, payload_ciphertext, expires_at)
         VALUES ($1, $2, 'draft', $3, $4, NOW() + INTERVAL '30 days')
         ON CONFLICT (application_type, token_hash) DO UPDATE
           SET payload_version = EXCLUDED.payload_version,
               payload_ciphertext = EXCLUDED.payload_ciphertext,
               updated_at = NOW(), expires_at = EXCLUDED.expires_at
           WHERE onboarding_applications.status = 'draft'
         RETURNING id`,
        [type, tokenHash(token), payload.version, encryptPayload(payload.data)],
        'onboarding.draft.write'
      );
      if (saved.length === 0) {
        token = randomBytes(32).toString('base64url');
        await query(
          `INSERT INTO onboarding_applications
             (application_type, token_hash, status, payload_version, payload_ciphertext, expires_at)
           VALUES ($1, $2, 'draft', $3, $4, NOW() + INTERVAL '30 days')`,
          [type, tokenHash(token), payload.version, encryptPayload(payload.data)],
          'onboarding.draft.create'
        );
      }
      writeTokenCookie(req, res, type, token);
      return res.json({ saved: true, savedAt: new Date().toISOString() });
    } catch (err: any) {
      console.error('[NEXG] onboarding draft write failed');
      return res.status(503).json({ error: 'Unable to save application draft' });
    }
  });

  app.post('/api/onboarding/:type/submit', async (req: Request, res: Response) => {
    const type = asApplicationType(req.params.type);
    if (!type) return res.status(404).json({ error: 'Unknown onboarding type' });
    if (!sameOrigin(req)) return res.status(403).json({ error: 'Request origin rejected' });
    const payload = readPayload(req);
    if (!payload) return res.status(400).json({ error: 'A valid application is required' });
    const issues = submissionIssues(type, payload.data);
    if (issues.length > 0) return res.status(422).json({ error: 'Application is incomplete', issues });
    res.setHeader('Cache-Control', 'no-store');
    try {
      await pruneExpiredDrafts();
      let token = readToken(req, type);
      if (!token) token = randomBytes(32).toString('base64url');
      const inserted = await query<{ id: string }>(
        `INSERT INTO onboarding_applications
           (application_type, token_hash, status, payload_version, payload_ciphertext, submitted_at, expires_at)
         VALUES ($1, $2, 'submitted', $3, $4, NOW(), NULL)
         ON CONFLICT (application_type, token_hash) DO UPDATE
           SET payload_version = EXCLUDED.payload_version,
               payload_ciphertext = EXCLUDED.payload_ciphertext,
               status = 'submitted', submitted_at = NOW(), updated_at = NOW(), expires_at = NULL
           WHERE onboarding_applications.status = 'draft'
         RETURNING id`,
        [type, tokenHash(token), payload.version, encryptPayload(payload.data)],
        'onboarding.submit'
      );
      if (inserted.length === 0) return res.status(409).json({ error: 'This application was already submitted' });
      clearTokenCookie(req, res, type);
      return res.status(201).json({ submitted: true, applicationId: inserted[0].id });
    } catch (err: any) {
      console.error('[NEXG] onboarding submission failed');
      return res.status(503).json({ error: 'Unable to submit application' });
    }
  });

  app.delete('/api/onboarding/:type/draft', async (req: Request, res: Response) => {
    const type = asApplicationType(req.params.type);
    if (!type) return res.status(404).json({ error: 'Unknown onboarding type' });
    if (!sameOrigin(req)) return res.status(403).json({ error: 'Request origin rejected' });
    try {
      const token = readToken(req, type);
      if (token) {
        await query(
          "DELETE FROM onboarding_applications WHERE application_type = $1 AND token_hash = $2 AND status = 'draft'",
          [type, tokenHash(token)],
          'onboarding.draft.delete'
        );
      }
      clearTokenCookie(req, res, type);
      return res.json({ deleted: true });
    } catch (err: any) {
      console.error('[NEXG] onboarding draft delete failed');
      return res.status(503).json({ error: 'Unable to clear application draft' });
    }
  });
}
