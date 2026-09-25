import { useCallback, useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Clock3, LoaderCircle, LogOut, ShieldCheck } from 'lucide-react';
import LogoIcon from './LogoIcon';

export type HostPortalPage = 'host_login' | 'host_apply' | 'host_status' | 'host_workspace' | 'host_review';

type HostSession = {
  accountId: string;
  role: 'host_owner';
  accountState: 'pending' | 'active' | 'rejected' | 'suspended';
  applicationState: 'submitted' | 'approved' | 'rejected';
};
type ApplicationStatus = {
  applicationId: string;
  state: 'submitted' | 'approved' | 'rejected';
  version: number;
  submittedAt: string;
  decisionAt?: string | null;
  decisionReason?: string | null;
};
type HostWorkspace = { accountId: string; organizationName: string; accessState: 'approved' };
type ReviewCase = {
  applicationId: string;
  state: 'submitted' | 'approved' | 'rejected';
  version: number;
  submittedAt: string;
  updatedAt: string;
};
type ReviewDetail = ReviewCase & {
  applicantName: string;
  applicantEmail: string;
  organizationName: string;
  location: string;
  propertyCount: number;
  propertyType: string;
  note?: string | null;
};
type ReviewSession = { reviewerId: string; displayName: string; capabilities: string[] };
type HostPortalProps = {
  page: HostPortalPage;
  onNavigate: (page: HostPortalPage | 'properties' | 'home') => void;
};

const HOST_API = '/api/v1/host';
const ADMIN_API = '/api/v1/admin/host-review';

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const problem = body as { title?: string; detail?: string; code?: string };
    throw new Error(problem.detail || problem.title || 'We could not complete that request. Please try again.');
  }
  return body as T;
}

function newOperationKey() {
  return crypto.randomUUID();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function BrandHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200/80 bg-white/85 px-5 py-4 backdrop-blur sm:px-8">
      <button type="button" onClick={onHome} aria-label="Return to NEXG home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">
        <LogoIcon variant="wordmark" className="h-10 w-[7.5rem]" />
      </button>
      <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-stone-600">HOST PORTAL</span>
    </header>
  );
}

function Field({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-800" htmlFor={id}>
      {label}
      <input
        id={id}
        {...props}
        className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-base font-normal text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 disabled:cursor-not-allowed disabled:bg-stone-100"
      />
    </label>
  );
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div role={error ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${error ? 'border-red-200 bg-red-50 text-red-900' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
      {error ? <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <Clock3 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
      <div>{children}</div>
    </div>
  );
}

function Button({ children, busy, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || busy}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B88728] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#976b1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${props.className ?? ''}`}
    >
      {busy && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

function HostAccessCard({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 bg-[#f7f5f0] lg:grid-cols-[minmax(0,1fr)_minmax(26rem,0.78fr)]">
      <section className="relative hidden overflow-hidden bg-[#201d18] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 20% 25%, #d8ad5a 0 1px, transparent 1.5px), radial-gradient(circle at 80% 72%, #d8ad5a 0 1px, transparent 1.5px)', backgroundSize: '32px 32px, 44px 44px' }} />
        <div className="relative">
          <LogoIcon variant="wordmark" className="h-12 w-36" />
          <p className="mt-2 text-xs font-semibold tracking-[0.22em] text-amber-200">HOST PORTAL</p>
        </div>
        <div className="relative max-w-xl pb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">For property teams</p>
          <h1 className="font-heading text-4xl font-bold leading-tight xl:text-5xl">One clear place to manage your NEXG host access.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-200">Apply with your property details. Our team reviews each application before Host workspace access is enabled.</p>
        </div>
        <p className="relative text-xs text-stone-400">Your application details are handled by the Host access service.</p>
      </section>
      <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_70px_rgba(43,35,20,0.08)] sm:p-8 lg:p-10">
          <div className="mb-7 lg:hidden"><LogoIcon variant="wordmark" className="h-10 w-32" /></div>
          {children}
        </div>
      </section>
    </div>
  );
}

export default function HostPortal({ page, onNavigate }: HostPortalProps) {
  const [hostSession, setHostSession] = useState<HostSession | null>(null);
  const [hostCsrf, setHostCsrf] = useState('');
  const [workspace, setWorkspace] = useState<HostWorkspace | null>(null);
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null);
  const [reviewCsrf, setReviewCsrf] = useState('');
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const applicationAttempt = useRef<{ payload: string; key: string } | null>(null);
  const decisionAttempt = useRef<{ payload: string; key: string } | null>(null);

  const loadHostSession = useCallback(async () => {
    const result = await request<{ data: HostSession; csrfToken: string }>(`${HOST_API}/sessions/current`);
    setHostSession(result.data);
    setHostCsrf(result.csrfToken);
    return result.data;
  }, []);

  const loadReviewSession = useCallback(async () => {
    const result = await request<{ data: ReviewSession; csrfToken: string }>(`${ADMIN_API}/sessions/current`);
    setReviewSession(result.data);
    setReviewCsrf(result.csrfToken);
    return result.data;
  }, []);

  const loadReviewCases = useCallback(async () => {
    const result = await request<{ data: ReviewCase[] }>(`${ADMIN_API}/applications?state=submitted&limit=50`);
    setCases(result.data);
  }, []);

  useEffect(() => {
    let live = true;
    setError('');
    setLoading(true);
    const hydrate = async () => {
      try {
        if (page === 'host_review') {
          try {
            await loadReviewSession();
            await loadReviewCases();
          } catch {
            if (live) setReviewSession(null);
          }
        } else {
          try {
            const session = await loadHostSession();
            if (session.accountState !== 'pending') {
              try {
                const own = await request<{ data: ApplicationStatus }>(`${HOST_API}/applications/current`);
                if (live) setApplication(own.data);
              } catch {
                if (live) setApplication(null);
              }
              if (live && session.accountState === 'active' && page === 'host_workspace') {
                try {
                  const access = await request<{ data: HostWorkspace }>(`${HOST_API}/workspace`);
                  if (live) setWorkspace(access.data);
                } catch (cause) {
                  if (live) {
                    setWorkspace(null);
                    setError(cause instanceof Error ? cause.message : 'We could not confirm Host workspace access.');
                  }
                }
              } else if (live && session.accountState === 'active') {
                setWorkspace(null);
                onNavigate('host_workspace');
              }
              else if (live && session.accountState !== 'active' && page !== 'host_status') onNavigate('host_status');
            } else if (live && page !== 'host_status' && page !== 'host_apply') {
              setWorkspace(null);
              onNavigate('host_status');
            }
          } catch {
            if (live) { setHostSession(null); setWorkspace(null); }
          }
        }
      } finally {
        if (live) setLoading(false);
      }
    };
    void hydrate();
    return () => { live = false; };
  }, [page, loadHostSession, loadReviewCases, loadReviewSession, onNavigate]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = JSON.stringify({
      fullName: String(form.get('fullName') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      password: String(form.get('password') ?? ''),
      organizationName: String(form.get('organizationName') ?? '').trim(),
      location: String(form.get('location') ?? '').trim(),
      propertyCount: Number(form.get('propertyCount')),
      propertyType: String(form.get('propertyType') ?? ''),
      note: String(form.get('note') ?? '').trim(),
    });
    if (!applicationAttempt.current || applicationAttempt.current.payload !== payload) {
      applicationAttempt.current = { payload, key: newOperationKey() };
    }
    try {
      await request(`${HOST_API}/applications`, {
        method: 'POST',
        headers: { 'Idempotency-Key': applicationAttempt.current.key },
        body: payload,
      });
      await request(`${HOST_API}/sessions`, {
        method: 'POST',
        body: JSON.stringify({ email: JSON.parse(payload).email, password: JSON.parse(payload).password }),
      });
      applicationAttempt.current = null;
      const session = await loadHostSession();
      const own = await request<{ data: ApplicationStatus }>(`${HOST_API}/applications/current`);
      setHostSession(session); setApplication(own.data); onNavigate('host_status');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not submit your application.');
    } finally { setLoading(false); }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await request<{ data: HostSession; csrfToken: string }>(`${HOST_API}/sessions`, {
        method: 'POST', body: JSON.stringify({ email: String(form.get('email') ?? '').trim(), password: String(form.get('password') ?? '') }),
      });
      setHostSession(result.data); setHostCsrf(result.csrfToken);
      setWorkspace(null);
      if (result.data.accountState === 'active') onNavigate('host_workspace');
      else onNavigate('host_status');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not sign you in.'); }
    finally { setLoading(false); }
  }

  async function signOutHost() {
    setError('');
    try { await request(`${HOST_API}/sessions/current`, { method: 'DELETE', headers: { 'X-CSRF-Token': hostCsrf } }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not sign out.'); return; }
    setHostSession(null); setHostCsrf(''); setApplication(null); setWorkspace(null); onNavigate('host_login');
  }

  async function signInReviewer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await request<{ data: ReviewSession; csrfToken: string }>(`${ADMIN_API}/sessions`, {
        method: 'POST', body: JSON.stringify({ email: String(form.get('email') ?? '').trim(), password: String(form.get('password') ?? '') }),
      });
      setReviewSession(result.data); setReviewCsrf(result.csrfToken); await loadReviewCases();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not sign in to review applications.'); }
    finally { setLoading(false); }
  }

  async function openReviewCase(applicationId: string) {
    setError(''); setLoading(true);
    try {
      const result = await request<{ data: ReviewDetail }>(`${ADMIN_API}/applications/${applicationId}`);
      setDetail(result.data); setDecision(null); setReason('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not load that application.'); }
    finally { setLoading(false); }
  }

  async function decideApplication() {
    if (!detail || !decision) return;
    setError(''); setLoading(true);
    const payload = JSON.stringify({ decision, reason: reason.trim() });
    const attemptIdentity = `${detail.applicationId}:${detail.version}:${payload}`;
    if (!decisionAttempt.current || decisionAttempt.current.payload !== attemptIdentity) {
      decisionAttempt.current = { payload: attemptIdentity, key: newOperationKey() };
    }
    try {
      const result = await request<{ data: { commandState: 'accepted' | 'unknown' } }>(`${ADMIN_API}/applications/${detail.applicationId}/decisions`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': reviewCsrf, 'Idempotency-Key': decisionAttempt.current.key, 'If-Match': `"${detail.version}"` },
        body: payload,
      });
      if (result.data.commandState === 'unknown') {
        setError('The decision is still being confirmed. Refresh the case before trying again.');
        return;
      }
      decisionAttempt.current = null;
      setDetail(null); setDecision(null); await loadReviewCases();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not save the review decision.'); }
    finally { setLoading(false); }
  }

  async function signOutReviewer() {
    try { await request(`${ADMIN_API}/sessions/current`, { method: 'DELETE', headers: { 'X-CSRF-Token': reviewCsrf } }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not sign out.'); return; }
    setReviewSession(null); setReviewCsrf(''); setCases([]); setDetail(null);
  }

  const signedIn = Boolean(hostSession);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-950">
      <BrandHeader onHome={() => onNavigate('home')} />
      {page === 'host_review' ? (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
          {!reviewSession ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
              <ShieldCheck className="mb-4 h-8 w-8 text-[#B88728]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">NEXG team access</p>
              <h1 className="mt-2 font-heading text-3xl font-bold">Review Host applications</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">This restricted area is for approved NEXG reviewers.</p>
              <form className="mt-7 grid gap-4" onSubmit={signInReviewer}>
                <Field id="review-email" name="email" type="email" label="Work email" autoComplete="username" required />
                <Field id="review-password" name="password" type="password" label="Password" autoComplete="current-password" required />
                {error && <Notice error>{error}</Notice>}
                <Button type="submit" busy={loading}>Sign in to review</Button>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">NEXG team · {reviewSession.displayName}</p><h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Host application review</h1><p className="mt-2 text-sm text-stone-600">Review details are read from the Host service. Decisions are recorded in both service audit trails.</p></div>
                <button type="button" onClick={() => void signOutReviewer()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
              </div>
              {error && <div className="mb-5"><Notice error>{error}</Notice></div>}
              {detail ? (
                <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="case-title">
                  <button type="button" onClick={() => setDetail(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to applications</button>
                  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Submitted {formatDate(detail.submittedAt)}</p><h2 id="case-title" className="mt-2 font-heading text-3xl font-bold">{detail.organizationName}</h2><p className="mt-1 text-sm text-stone-600">Application {detail.applicationId}</p></div><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-950">{detail.state}</span></div>
                  <dl className="mt-7 grid gap-4 border-y border-stone-200 py-6 sm:grid-cols-2">
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Applicant</dt><dd className="mt-1 font-semibold">{detail.applicantName}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Email</dt><dd className="mt-1 break-all font-semibold">{detail.applicantEmail}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Location</dt><dd className="mt-1 font-semibold">{detail.location}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Property type and count</dt><dd className="mt-1 font-semibold">{detail.propertyType.replaceAll('_', ' ')} · {detail.propertyCount}</dd></div>
                    {detail.note && <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Applicant note</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-6">{detail.note}</dd></div>}
                  </dl>
                  {detail.state === 'submitted' && (
                    <div className="mt-6 grid gap-4">
                      <label className="grid gap-2 text-sm font-semibold text-stone-800" htmlFor="review-reason">Decision reason <span className="font-normal text-stone-500">(at least 8 characters; shared with the applicant)</span><textarea id="review-reason" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} className="w-full rounded-xl border border-stone-300 px-3.5 py-3 font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20" /></label>
                      {!decision ? (
                        <div className="flex flex-wrap gap-3"><button type="button" disabled={reason.trim().length < 8 || loading} onClick={() => setDecision('approve')} className="min-h-11 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">Approve access</button><button type="button" disabled={reason.trim().length < 8 || loading} onClick={() => setDecision('reject')} className="min-h-11 rounded-xl border border-red-300 bg-white px-5 text-sm font-bold text-red-800 hover:bg-red-50 disabled:opacity-50">Reject application</button></div>
                      ) : (
                        <div role="group" aria-label="Confirm application decision" className="rounded-xl border border-amber-300 bg-amber-50 p-4"><p className="font-semibold">Confirm {decision === 'approve' ? 'approval' : 'rejection'} for {detail.organizationName}?</p><p className="mt-1 text-sm text-stone-700">This decision is recorded and changes the applicant’s Host access.</p><div className="mt-4 flex flex-wrap gap-3"><Button type="button" busy={loading} onClick={() => void decideApplication()}>Confirm {decision}</Button><button type="button" disabled={loading} onClick={() => setDecision(null)} className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold">Cancel</button></div></div>
                      )}
                    </div>
                  )}
                </section>
              ) : (
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm" aria-labelledby="queue-title">
                  <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4"><div><h2 id="queue-title" className="font-heading text-xl font-bold">Pending applications</h2><p className="mt-1 text-sm text-stone-600">{cases.length} awaiting review</p></div><button type="button" onClick={() => void loadReviewCases()} className="min-h-10 rounded-lg border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50">Refresh</button></div>
                  {cases.length ? <ul className="divide-y divide-stone-100">{cases.map((item) => <li key={item.applicationId}><button type="button" onClick={() => void openReviewCase(item.applicationId)} className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-700"><span><span className="block font-semibold">Host application</span><span className="mt-1 block text-xs text-stone-500">{item.applicationId} · {formatDate(item.submittedAt)}</span></span><ArrowRight className="h-4 w-4 text-stone-500" aria-hidden="true" /></button></li>)}</ul> : <div className="p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" aria-hidden="true" /><p className="mt-3 font-semibold">No applications are waiting</p><p className="mt-1 text-sm text-stone-600">New applications appear here after their event is received.</p></div>}
                </section>
              )}
            </>
          )}
        </main>
      ) : (
        <HostAccessCard>
          {page === 'host_login' && (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Approved property partners</p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Sign in to your Host Portal</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">Use the email and password you created when you applied. Host workspace access starts after NEXG approves your application.</p>
              {error && <div className="mt-5"><Notice error>{error}</Notice></div>}
              <form className="mt-7 grid gap-4" onSubmit={signIn}>
                <Field id="host-email" name="email" type="email" label="Email address" autoComplete="username" required />
                <Field id="host-password" name="password" type="password" label="Password" autoComplete="current-password" required />
                <Button type="submit" busy={loading}>Sign in</Button>
              </form>
              <p className="mt-6 text-sm text-stone-600">Need Host access? <button type="button" onClick={() => onNavigate('host_apply')} className="font-bold text-[#8a611b] underline decoration-amber-500 underline-offset-4">Apply for a Host account</button></p>
            </>
          )}
          {page === 'host_apply' && (
            <>
              <button type="button" onClick={() => onNavigate('host_login')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to sign in</button>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Create your Host account</p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Apply for Host access</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">Create your sign-in and tell us about your property business. Your account stays in review until NEXG makes a decision.</p>
              {error && <div className="mt-5"><Notice error>{error}</Notice></div>}
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submitApplication}>
                <Field id="apply-name" name="fullName" label="Your full name" autoComplete="name" minLength={2} maxLength={120} required />
                <Field id="apply-email" name="email" type="email" label="Work email" autoComplete="email" maxLength={254} required />
                <div className="sm:col-span-2"><Field id="apply-password" name="password" type="password" label="Create a password (12 characters or more)" autoComplete="new-password" minLength={12} maxLength={128} required /></div>
                <div className="sm:col-span-2"><Field id="organization" name="organizationName" label="Property business name" autoComplete="organization" minLength={2} maxLength={160} required /></div>
                <Field id="location" name="location" label="Town or area" autoComplete="address-level2" minLength={2} maxLength={160} required />
                <Field id="property-count" name="propertyCount" type="number" label="Number of properties" min={1} max={1000} defaultValue={1} required />
                <label htmlFor="property-type" className="grid gap-2 text-sm font-semibold text-stone-800 sm:col-span-2">Property type<select id="property-type" name="propertyType" required defaultValue="" className="min-h-12 rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-base font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"><option value="" disabled>Select a property type</option><option value="hotel">Hotel</option><option value="serviced_apartment">Serviced apartment</option><option value="lodge">Lodge</option><option value="short_stay">Short-stay accommodation</option><option value="other">Other</option></select></label>
                <label htmlFor="application-note" className="grid gap-2 text-sm font-semibold text-stone-800 sm:col-span-2">Anything else we should know? <span className="font-normal text-stone-500">Optional</span><textarea id="application-note" name="note" maxLength={1000} rows={3} className="rounded-xl border border-stone-300 px-3.5 py-3 font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20" /></label>
                <div className="sm:col-span-2"><Notice>We only ask for basic property and contact details here. Do not enter bank, payment or identity-document information.</Notice></div>
                <div className="sm:col-span-2"><Button type="submit" busy={loading} className="w-full">Submit application</Button></div>
              </form>
            </>
          )}
          {page === 'host_status' && (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Application status</p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{application?.state === 'rejected' ? 'We could not approve this application' : application?.state === 'approved' ? 'Your Host access is approved' : 'Your application is under review'}</h1>
              {error && <div className="mt-5"><Notice error>{error}</Notice></div>}
              <div className="mt-6"><Notice>{application?.state === 'rejected' ? application.decisionReason || 'Contact NEXG support if you need help with this decision.' : application?.state === 'approved' ? 'You can now sign in to enter your Host workspace.' : 'NEXG will review your details. You can sign in again later to check for an update.'}</Notice></div>
              {application && <p className="mt-4 text-xs text-stone-500">Application reference: {application.applicationId} · Submitted {formatDate(application.submittedAt)}</p>}
              <div className="mt-7 flex flex-wrap gap-3">{application?.state === 'approved' ? <Button type="button" onClick={() => onNavigate('host_workspace')}>Open Host workspace<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button> : <button type="button" onClick={() => void signOutHost()} className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold hover:bg-stone-50">Sign out</button>}<button type="button" onClick={() => void request<{ data: ApplicationStatus }>(`${HOST_API}/applications/current`).then((result) => setApplication(result.data)).catch((cause) => setError(cause instanceof Error ? cause.message : 'Status is unavailable.'))} className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold hover:bg-stone-50">Refresh status</button></div>
            </>
          )}
          {page === 'host_workspace' && (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Host Portal</p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{workspace ? 'Your Host access is confirmed' : 'Host workspace access'}</h1>
              {error && <div className="mt-5"><Notice error>{error}</Notice></div>}
              {workspace ? <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><p className="font-bold">{workspace.organizationName} · approved Host workspace</p><p className="mt-1">Workspace access is confirmed. Property, reservation and guest operations will be added only after their source APIs and Host-specific plans are ready.</p></div> : <div className="mt-6"><Notice error={!signedIn}>{signedIn ? 'We could not confirm your Host workspace access. Refresh or contact NEXG support.' : 'Sign in with an approved Host account to continue.'}</Notice></div>}
              <div className="mt-7 flex flex-wrap gap-3">{hostSession?.accountState === 'active' ? <button type="button" onClick={() => void signOutHost()} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold hover:bg-stone-50"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button> : <Button type="button" onClick={() => onNavigate('host_login')}>Go to sign in</Button>}<button type="button" onClick={() => onNavigate('properties')} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-stone-600 hover:bg-stone-200">Back to NEXG</button></div>
            </>
          )}
        </HostAccessCard>
      )}
      <footer className="border-t border-stone-200 bg-white px-5 py-4 text-center text-xs text-stone-500">NEXG Host Portal · Application decisions are made by an authorized NEXG reviewer.</footer>
      {loading && <span className="sr-only" role="status">Loading</span>}
    </div>
  );
}
