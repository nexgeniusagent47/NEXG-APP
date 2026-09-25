export type OnboardingType = 'merchant' | 'courier' | 'host';

export interface OnboardingDraft<T = Record<string, unknown>> {
  version: number;
  savedAt: string;
  data: T;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(result?.issues) ? `: ${result.issues.join(' ')}` : '';
    throw new Error(`${result?.error ?? 'Request failed'}${details}`);
  }
  return result as T;
}

export async function loadOnboardingDraft<T = Record<string, unknown>>(
  type: OnboardingType,
): Promise<OnboardingDraft<T> | null> {
  const result = await request<{ draft: OnboardingDraft<T> | null }>(`/api/onboarding/${type}/draft`);
  return result.draft;
}

export async function saveOnboardingDraft(
  type: OnboardingType,
  data: Record<string, unknown>,
  version = 1,
): Promise<{ saved: true; savedAt: string }> {
  return request(`/api/onboarding/${type}/draft`, {
    method: 'PUT',
    body: JSON.stringify({ version, data }),
  });
}

export async function submitOnboardingApplication(
  type: OnboardingType,
  data: Record<string, unknown>,
  version = 1,
): Promise<{ submitted: true; applicationId: string }> {
  return request(`/api/onboarding/${type}/submit`, {
    method: 'POST',
    body: JSON.stringify({ version, data }),
  });
}

export async function deleteOnboardingDraft(type: OnboardingType): Promise<void> {
  await request(`/api/onboarding/${type}/draft`, { method: 'DELETE' });
}
