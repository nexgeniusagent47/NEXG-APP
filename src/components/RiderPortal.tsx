import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bike,
  Bell,
  CheckCircle2,
  Clock3,
  LogOut,
  Moon,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sun,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import LogoIcon from './LogoIcon';
import { useTheme } from '../context/ThemeContext';

type PortalPage = 'home' | 'couriers';
type RiderPortalProps = { onNavigate: (page: PortalPage) => void };
type RiderIdentity = {
  account_id: string;
  display_name: string | null;
  phone: string | null;
  profile_status: string;
};
type WidgetStatus = 'ready' | 'empty' | 'unavailable';
type Widget<T = unknown> = {
  status: WidgetStatus;
  value: T | null;
  source: string;
  as_of: string | null;
  message?: string;
};
type AssignedJob = {
  id: string;
  status: string;
  merchant_name: string | null;
  created_at: string;
  updated_at: string;
};
type RiderDashboard = {
  as_of: string;
  widgets: {
    availability: Widget;
    assigned_jobs: Widget<{ items: AssignedJob[]; count: number }>;
    earnings_today: Widget;
    completed_deliveries: Widget<{ total: number }>;
    performance_summary: Widget;
    active_delivery: Widget<AssignedJob>;
    incentives_and_bonuses: Widget;
    recent_notifications: Widget;
    quick_actions: Widget<Array<{ id: string; label: string }>>;
  };
};

const API = '/api/v1/rider';
const sections = [
  ['availability', 'Availability'],
  ['assigned-jobs', 'Assigned jobs'],
  ['earnings-today', 'Earnings'],
  ['completed-deliveries', 'Completed'],
  ['performance-summary', 'Performance'],
  ['active-delivery', 'Active delivery'],
  ['incentives', 'Incentives'],
  ['recent-notifications', 'Notifications'],
  ['quick-actions', 'Quick actions'],
] as const;

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    cache: 'no-store',
  });
  const body = await response.json().catch(() => null) as { data?: T; error?: string } | null;
  if (!response.ok) {
    const error = new Error(body?.error ?? 'rider_service_unavailable') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return body?.data as T;
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    ACCEPTED: 'Accepted',
    ARRIVED_PICKUP: 'At pickup',
    PICKED: 'Picked up',
    ARRIVED_DROP: 'At delivery',
    not_submitted: 'Profile not submitted',
    pending: 'Profile pending review',
    approved: 'Approved rider',
    rejected: 'Profile needs attention',
  };
  return labels[status] ?? status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function Surface({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${className}`}>{children}</section>;
}

function WidgetMeta({ widget, secondaryText }: { widget: Widget; secondaryText: string }) {
  const updated = formatTime(widget.as_of);
  return (
    <div className={`mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3 text-xs ${secondaryText}`}>
      <span>Source: {widget.source}</span>
      {updated && <time dateTime={widget.as_of ?? undefined}>Updated {updated}</time>}
    </div>
  );
}

function Unavailable({ widget, secondaryText, isLight }: { widget: Widget; secondaryText: string; isLight: boolean }) {
  return (
    <div className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/10 bg-white/[0.025] text-gray-300'}`}>
      {widget.message ?? 'This information is not available yet.'}
      <WidgetMeta widget={widget} secondaryText={secondaryText} />
    </div>
  );
}

function SectionTitle({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#B88728] dark:text-[#E5B65F]">{icon}</span>
      <div className="min-w-0">
        <h2 className="text-lg font-bold leading-tight sm:text-xl" style={{ fontFamily: 'Quicksand, sans-serif' }}>{title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function RiderPortal({ onNavigate }: RiderPortalProps) {
  const { isLight, toggleTheme } = useTheme();
  const [identity, setIdentity] = useState<RiderIdentity | null>(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [dashboard, setDashboard] = useState<RiderDashboard | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [authError, setAuthError] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const page = isLight ? 'bg-[#F7F8FA] text-[#1A1D20]' : 'bg-[#111315] text-[#F2F2F2]';
  const surface = isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#181A1F]';
  const divider = isLight ? 'border-slate-200' : 'border-white/10';
  const secondaryText = isLight ? 'text-slate-600' : 'text-gray-400';
  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88728] dark:focus-visible:outline-[#E5B65F]';
  const accent = isLight ? 'text-[#8A6413]' : 'text-[#E5B65F]';

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    setServiceError('');
    try {
      const result = await request<RiderDashboard>('/dashboard');
      setDashboard(result);
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      if (status === 401) {
        setIdentity(null);
        setDashboard(null);
        setCsrfToken('');
      } else {
        setServiceError('The Rider service could not refresh this dashboard. Your session is still held securely; retry when the service is available.');
      }
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    let active = true;
    request<{ identity: RiderIdentity; csrf_token: string }>('/session')
      .then(async (session) => {
        if (!active) return;
        setIdentity(session.identity);
        setCsrfToken(session.csrf_token);
        setLoadingSession(false);
        await fetchDashboard();
      })
      .catch((error) => {
        if (!active) return;
        const status = (error as Error & { status?: number }).status;
        if (status === 401) {
          setIdentity(null);
        } else {
          setServiceError('The Rider service is not reachable. Start the local Rider API and try again.');
        }
        setLoadingSession(false);
      });
    return () => { active = false; };
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    setServiceError('');
    try {
      const session = await request<{ identity: RiderIdentity; csrf_token: string }>('/session', {
        method: 'POST',
        body: JSON.stringify({ phone: phone.trim(), pin }),
      });
      setIdentity(session.identity);
      setCsrfToken(session.csrf_token);
      setPin('');
      await fetchDashboard();
    } catch (error) {
      const code = (error as Error).message;
      setAuthError(code === 'invalid_credentials' ? 'Phone number or PIN was not accepted.'
        : code === 'rider_access_required' ? 'This account does not have Rider access.'
          : code === 'too_many_attempts' ? 'Too many sign-in attempts. Wait a few minutes and try again.'
            : code === 'platform_unavailable' ? 'NEXG Identity is not reachable right now.'
              : 'Rider sign-in failed. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = async () => {
    setServiceError('');
    try {
      await request('/session', { method: 'DELETE', headers: { 'X-CSRF-Token': csrfToken } });
      setIdentity(null);
      setDashboard(null);
      setCsrfToken('');
    } catch {
      setServiceError('Sign out could not reach the Rider service. Retry when it is available.');
    }
  };

  const today = new Intl.DateTimeFormat('en-KE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  if (loadingSession) {
    return (
      <div className={`flex min-h-screen flex-1 items-center justify-center ${page}`}>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300" role="status">
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking Rider session…
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className={`min-h-screen flex-1 ${page}`}>
        <header className={`border-b ${divider} ${isLight ? 'bg-white' : 'bg-[#111315]'}`}>
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => onNavigate('couriers')} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold ${secondaryText} ${focus}`}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">For couriers</span>
              </button>
              <span className={`h-7 border-l ${divider}`} aria-hidden="true" />
              <button type="button" onClick={() => onNavigate('home')} aria-label="NEXG App home" className={focus}>
                <LogoIcon variant="wordmark" className="h-6 w-auto" />
              </button>
            </div>
            <button type="button" onClick={toggleTheme} aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'} className={`flex h-10 w-10 items-center justify-center rounded-full border ${divider} ${focus}`}>
              {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </header>
        <main className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-16">
          <div className="max-w-2xl">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${isLight ? 'border-amber-300 bg-amber-50 text-[#76530B]' : 'border-[#E5B65F]/30 bg-[#E5B65F]/10 text-[#F2D69B]'}`}>
              <Bike className="h-3.5 w-3.5" aria-hidden="true" /> Rider workspace
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Quicksand, sans-serif' }}>Your workday, in one place.</h1>
            <p className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg ${secondaryText}`}>
              Sign in with your NEXG Rider account to see assigned deliveries and the connected services available to your account.
            </p>
            <div className={`mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm ${secondaryText}`}>
              <span className="inline-flex items-center gap-2"><ShieldCheck className={`h-4 w-4 ${accent}`} aria-hidden="true" /> Central account verification</span>
              <span className="inline-flex items-center gap-2"><PackageCheck className={`h-4 w-4 ${accent}`} aria-hidden="true" /> Assigned work only</span>
            </div>
          </div>
          <Surface className={`${surface} p-6 sm:p-8`}>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Rider sign in</h2>
            <p className={`mt-2 text-sm leading-relaxed ${secondaryText}`}>Use the phone number and PIN on your NEXG Rider account.</p>
            {serviceError && (
              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${isLight ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`} role="alert">{serviceError}</div>
            )}
            {authError && (
              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${isLight ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`} role="alert">{authError}</div>
            )}
            <form onSubmit={signIn} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold" htmlFor="rider-phone">Phone number</label>
              <input id="rider-phone" name="phone" type="tel" autoComplete="username" inputMode="tel" required maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} className={`min-h-12 w-full rounded-xl border px-3 text-base ${divider} ${isLight ? 'bg-white text-slate-900' : 'bg-[#111315] text-white'} ${focus}`} />
              <label className="block pt-1 text-sm font-semibold" htmlFor="rider-pin">PIN</label>
              <input id="rider-pin" name="pin" type="password" autoComplete="current-password" inputMode="numeric" required maxLength={64} value={pin} onChange={(event) => setPin(event.target.value)} className={`min-h-12 w-full rounded-xl border px-3 text-base ${divider} ${isLight ? 'bg-white text-slate-900' : 'bg-[#111315] text-white'} ${focus}`} />
              <button type="submit" disabled={submitting} className={`mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-60 ${isLight ? 'bg-[#B88728] text-slate-950 hover:bg-[#9e721d]' : 'bg-[#E5B65F] text-[#17130B] hover:bg-[#d6a54d]'} ${focus}`}>
                {submitting ? <><RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
              </button>
            </form>
            <p className={`mt-5 border-t pt-4 text-xs leading-relaxed ${divider} ${secondaryText}`}>Rider access is issued through NEXG. This portal will not create an account or store your PIN in the browser.</p>
          </Surface>
        </main>
      </div>
    );
  }

  const widgets = dashboard?.widgets;
  const assignedWidget = widgets?.assigned_jobs;
  const assignedJobs = assignedWidget?.status === 'ready' || assignedWidget?.status === 'empty'
    ? assignedWidget.value?.items ?? [] : [];
  const activeWidget = widgets?.active_delivery;
  const activeDelivery = activeWidget?.status === 'ready' ? activeWidget.value : null;
  const completedWidget = widgets?.completed_deliveries;
  const completedTotal = completedWidget?.status === 'ready' ? completedWidget.value?.total ?? 0 : null;
  const profileNeedsReview = identity.profile_status !== 'approved';

  return (
    <div className={`min-h-screen flex-1 ${page}`}>
      <header className={`sticky top-0 z-30 border-b backdrop-blur ${divider} ${isLight ? 'bg-white/95' : 'bg-[#111315]/95'}`}>
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={() => onNavigate('couriers')} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold ${secondaryText} ${focus}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">For couriers</span>
            </button>
            <span className={`h-7 border-l ${divider}`} aria-hidden="true" />
            <button type="button" onClick={() => onNavigate('home')} aria-label="NEXG App home" className={`rounded-sm ${focus}`}>
              <LogoIcon variant="wordmark" className="h-6 w-auto" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`hidden rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${profileNeedsReview ? (isLight ? 'border-amber-300 bg-amber-50 text-[#76530B]' : 'border-[#E5B65F]/30 bg-[#E5B65F]/10 text-[#F2D69B]') : (isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300')}`}>
              {formatStatus(identity.profile_status)}
            </span>
            <button type="button" onClick={toggleTheme} aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'} className={`flex h-10 w-10 items-center justify-center rounded-full border ${divider} ${secondaryText} ${focus}`}>
              {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => void signOut()} className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold ${divider} ${secondaryText} ${focus}`}>
              <LogOut className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main id="overview" className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className={`mb-2 text-sm font-medium ${secondaryText}`}>{today}</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl" style={{ fontFamily: 'Quicksand, sans-serif' }}>Rider dashboard</h1>
            <p className={`mt-2 text-base ${secondaryText}`}>Welcome{identity.display_name ? `, ${identity.display_name}` : ''}. Your dashboard is connected to NEXG services.</p>
          </div>
          <button type="button" onClick={() => void fetchDashboard()} disabled={loadingDashboard} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:opacity-60 ${divider} ${focus}`}>
            <RefreshCw className={`h-4 w-4 ${loadingDashboard ? 'animate-spin' : ''}`} aria-hidden="true" />{loadingDashboard ? 'Refreshing…' : 'Refresh dashboard'}
          </button>
        </div>

        {profileNeedsReview && (
          <div className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${isLight ? 'border-amber-300 bg-amber-50 text-[#503A0B]' : 'border-[#E5B65F]/30 bg-[#E5B65F]/10 text-[#F2D69B]'}`} role="status">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Your NEXG rider profile is <strong>{formatStatus(identity.profile_status).toLowerCase()}</strong>. The dashboard only shows work assigned to your account. Contact Rider Operations if this status is unexpected.</p>
          </div>
        )}
        {serviceError && (
          <div className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${isLight ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`} role="alert">
            <span>{serviceError}</span>
            <button type="button" onClick={() => void fetchDashboard()} className={`min-h-9 rounded-full border px-3 font-semibold ${focus}`}>Retry</button>
          </div>
        )}

        <nav aria-label="Rider dashboard sections" className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${divider} ${secondaryText} hover:text-current ${focus}`}>{label}</a>
          ))}
        </nav>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          <Surface id="availability" className={surface}>
            <SectionTitle icon={<Bike className="h-5 w-5" aria-hidden="true" />} title="Availability status" description="Dispatch controls online availability." />
            <Unavailable widget={widgets?.availability ?? { status: 'unavailable', value: null, source: 'Dispatch API', as_of: null, message: 'Loading dashboard data…' }} secondaryText={secondaryText} isLight={isLight} />
          </Surface>

          <Surface id="assigned-jobs" className={surface}>
            <SectionTitle icon={<PackageCheck className="h-5 w-5" aria-hidden="true" />} title="Assigned jobs" description="Deliveries assigned to your Rider account." />
            {assignedWidget?.status === 'unavailable' || !assignedWidget ? (
              <Unavailable widget={assignedWidget ?? { status: 'unavailable', value: null, source: 'Core Delivery API', as_of: null, message: 'Loading assigned work…' }} secondaryText={secondaryText} isLight={isLight} />
            ) : assignedJobs.length === 0 ? (
              <div className={`mt-5 rounded-xl border px-4 py-5 text-sm ${divider} ${secondaryText}`}>
                <p className="font-semibold text-current">No active deliveries assigned</p>
                <p className="mt-1">When a delivery is assigned to your account, it will appear here.</p>
                <WidgetMeta widget={assignedWidget} secondaryText={secondaryText} />
              </div>
            ) : (
              <ul className={`mt-4 divide-y ${divider}`}>
                {assignedJobs.map((job) => (
                  <li key={job.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{job.merchant_name || 'Assigned delivery'}</p>
                      <p className={`mt-1 text-xs ${secondaryText}`}>Delivery {job.id}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isLight ? 'bg-amber-50 text-[#76530B]' : 'bg-[#E5B65F]/10 text-[#F2D69B]'}`}>{formatStatus(job.status)}</span>
                  </li>
                ))}
                <li className="pt-2"><WidgetMeta widget={assignedWidget} secondaryText={secondaryText} /></li>
              </ul>
            )}
          </Surface>

          <Surface id="earnings-today" className={surface}>
            <SectionTitle icon={<Wallet className="h-5 w-5" aria-hidden="true" />} title="Earnings today" description="Verified earnings from the Finance service." />
            <Unavailable widget={widgets?.earnings_today ?? { status: 'unavailable', value: null, source: 'Finance API', as_of: null, message: 'Loading earnings…' }} secondaryText={secondaryText} isLight={isLight} />
          </Surface>

          <Surface id="completed-deliveries" className={surface}>
            <SectionTitle icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} title="Completed deliveries" description="Assigned delivery records in delivered status." />
            {completedTotal === null ? (
              <Unavailable widget={completedWidget ?? { status: 'unavailable', value: null, source: 'Core Delivery API', as_of: null, message: 'Loading completed deliveries…' }} secondaryText={secondaryText} isLight={isLight} />
            ) : (
              <>
                <p className="mt-6 text-4xl font-bold tabular-nums">{completedTotal}</p>
                <p className={`mt-1 text-sm ${secondaryText}`}>Recorded by Core Delivery</p>
                <WidgetMeta widget={completedWidget!} secondaryText={secondaryText} />
              </>
            )}
          </Surface>

          <Surface id="performance-summary" className={surface}>
            <SectionTitle icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />} title="Performance summary" description="Metrics defined and published by Analytics." />
            <Unavailable widget={widgets?.performance_summary ?? { status: 'unavailable', value: null, source: 'Analytics API', as_of: null, message: 'Loading performance metrics…' }} secondaryText={secondaryText} isLight={isLight} />
          </Surface>

          <Surface id="active-delivery" className={surface}>
            <SectionTitle icon={<Clock3 className="h-5 w-5" aria-hidden="true" />} title="Active delivery" description="Current delivery state from Core Delivery." />
            {activeWidget?.status === 'unavailable' || !activeWidget ? (
              <Unavailable widget={activeWidget ?? { status: 'unavailable', value: null, source: 'Core Delivery API', as_of: null, message: 'Loading active delivery…' }} secondaryText={secondaryText} isLight={isLight} />
            ) : activeDelivery ? (
              <div className={`mt-5 rounded-xl border p-4 ${divider}`}>
                <p className="text-base font-semibold">{activeDelivery.merchant_name || 'Assigned delivery'}</p>
                <p className={`mt-1 text-sm ${secondaryText}`}>Delivery {activeDelivery.id}</p>
                <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isLight ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-400/10 text-emerald-300'}`}>{formatStatus(activeDelivery.status)}</span>
                <WidgetMeta widget={activeWidget} secondaryText={secondaryText} />
              </div>
            ) : (
              <div className={`mt-5 rounded-xl border px-4 py-5 text-sm ${divider} ${secondaryText}`}>
                {activeWidget.message ?? 'There is no active delivery assigned to your account.'}
                <WidgetMeta widget={activeWidget} secondaryText={secondaryText} />
              </div>
            )}
          </Surface>

          <Surface id="incentives" className={surface}>
            <SectionTitle icon={<Zap className="h-5 w-5" aria-hidden="true" />} title="Incentives and bonuses" description="Offers published by the Rewards service." />
            <Unavailable widget={widgets?.incentives_and_bonuses ?? { status: 'unavailable', value: null, source: 'Rewards API', as_of: null, message: 'Loading incentives…' }} secondaryText={secondaryText} isLight={isLight} />
          </Surface>

          <Surface id="recent-notifications" className={surface}>
            <SectionTitle icon={<Bell className="h-5 w-5" aria-hidden="true" />} title="Recent notifications" description="Updates targeted to this Rider account." />
            <Unavailable widget={widgets?.recent_notifications ?? { status: 'unavailable', value: null, source: 'Notifications API', as_of: null, message: 'Loading notifications…' }} secondaryText={secondaryText} isLight={isLight} />
          </Surface>

          <Surface id="quick-actions" className={surface}>
            <SectionTitle icon={<Activity className="h-5 w-5" aria-hidden="true" />} title="Quick actions" description="Useful actions for this dashboard." />
            <div className={`mt-5 divide-y ${divider}`}>
              <a href="#assigned-jobs" className={`flex min-h-12 items-center justify-between gap-3 py-2 text-sm font-semibold ${accent} ${focus}`}>
                View assigned jobs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <button type="button" onClick={() => void fetchDashboard()} disabled={loadingDashboard} className={`flex min-h-12 w-full items-center justify-between gap-3 py-2 text-left text-sm font-semibold ${accent} disabled:opacity-60 ${focus}`}>
                {loadingDashboard ? 'Refreshing dashboard…' : 'Refresh dashboard'} <RefreshCw className={`h-4 w-4 ${loadingDashboard ? 'animate-spin' : ''}`} aria-hidden="true" />
              </button>
            </div>
            {widgets?.quick_actions && <WidgetMeta widget={widgets.quick_actions} secondaryText={secondaryText} />}
          </Surface>
        </div>

        <p className={`mt-8 text-center text-xs ${secondaryText}`}>
          Dashboard values come from the named service shown on each card. Unavailable services do not use sample data.
        </p>
      </main>
    </div>
  );
}
