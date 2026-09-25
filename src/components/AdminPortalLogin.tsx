import { useId, useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LogoIcon from './LogoIcon';

interface AdminPortalLoginProps {
  onNavigate: (page: string) => void;
}

/**
 * Static admin sign-in visual prototype.
 *
 * There is intentionally no authentication or recovery integration here. The form
 * never reads the entered values, persists them, or sends a request.
 */
export default function AdminPortalLogin({ onNavigate }: AdminPortalLoginProps) {
  const { isLight } = useTheme();
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Admin sign-in is not connected in this prototype. No request was sent.');
  };

  const showRecoveryNotice = () => {
    setNotice('Password recovery is not connected in this prototype. No request was sent.');
  };

  return (
    <div
      className={`min-h-[100svh] ${
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#101214] text-[#f2f2f2]'
      }`}
    >
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1600px] lg:grid-cols-[1.02fr_0.98fr]">
        <aside
          className={`relative hidden min-h-[100svh] overflow-hidden lg:flex ${
            isLight ? 'bg-[#181a1f] text-white' : 'bg-[#0b0d0e] text-white'
          }`}
          aria-label="NEXG admin portal"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 22% 30%, rgba(229,182,95,0.13), transparent 42%), radial-gradient(ellipse at 78% 82%, rgba(255,255,255,0.06), transparent 34%)',
            }}
          />
          <div className="pointer-events-none absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-16 top-[31%] h-[22rem] w-[22rem] rounded-full border border-white/10" aria-hidden="true" />
          <div className="relative flex min-h-[100svh] w-full flex-col justify-between px-12 py-10 xl:px-16 xl:py-12">
            <div className="flex items-center gap-3">
              <LogoIcon variant="wordmark" className="h-10 w-auto" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                  Admin portal
                </p>
              </div>
            </div>

            <div className="relative max-w-xl pb-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5B65F]" aria-hidden="true" />
                Access preview
              </div>
              <h1 className="max-w-lg text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
                Operations, with clarity.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/70 xl:text-base">
                A focused entry point for the people who keep NEXG moving. Admin access is not
                connected yet.
              </p>
              <div className="mt-9 flex items-center gap-3 text-xs font-medium text-white/55">
                <ShieldCheck size={16} className="text-[#E5B65F]" aria-hidden="true" />
                <span>Visual prototype · no sign-in or data access</span>
              </div>
            </div>

            <p className="text-[11px] font-medium tracking-wide text-white/45">
              NEXG App · Nairobi
            </p>
          </div>
        </aside>

        <section
          className="flex min-h-[100svh] items-center justify-center px-5 py-8 sm:px-8 lg:px-12"
          aria-labelledby="admin-access-heading"
        >
          <div className="w-full max-w-[440px]">
              <div className="mb-10 flex items-center justify-between gap-4 lg:mb-14">
              <div className="flex items-center gap-2.5 lg:hidden">
                <LogoIcon variant="wordmark" className="h-9 w-auto" />
                <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isLight ? 'text-slate-500' : 'text-white/55'}`}>
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2 ${
                  isLight
                    ? 'text-slate-600 hover:bg-slate-200/70 focus-visible:ring-offset-[#f7f8fa]'
                    : 'text-white/70 hover:bg-white/10 focus-visible:ring-offset-[#101214]'
                }`}
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to NEXG
              </button>
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B88728]/30 bg-[#E5B65F]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b6419] dark:text-[#F1C873]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B88728] dark:bg-[#E5B65F]" aria-hidden="true" />
              Sign-in preview
            </div>

            <h2 id="admin-access-heading" className="text-3xl font-bold leading-tight tracking-tight sm:text-[2.1rem]">
              Admin access
            </h2>
            <p
              id="admin-access-description"
              className={`mt-3 max-w-sm text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-[#B9BEC4]'}`}
            >
              This screen previews the NEXG admin sign-in. Access is not connected, and this page
              will not send or save your details.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label
                  htmlFor={emailId}
                  className={`mb-2 block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-white/85'}`}
                >
                  Work email
                </label>
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  placeholder="name@company.com"
                  required
                  className={`h-[52px] w-full rounded-xl border px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#B88728] focus:ring-2 focus:ring-[#B88728]/20 ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-white/15 bg-white/[0.045] text-white placeholder:text-white/35'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor={passwordId}
                  className={`mb-2 block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-white/85'}`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="off"
                    placeholder="Enter your password"
                    required
                    className={`h-[52px] w-full rounded-xl border py-3 pl-4 pr-14 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#B88728] focus:ring-2 focus:ring-[#B88728]/20 ${
                      isLight
                        ? 'border-slate-300 bg-white text-slate-900'
                        : 'border-white/15 bg-white/[0.045] text-white placeholder:text-white/35'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className={`absolute inset-y-0 right-1 inline-flex min-h-11 min-w-11 items-center justify-center self-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] ${
                      isLight ? 'text-slate-500 hover:bg-slate-100' : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={showRecoveryNotice}
                  className="min-h-11 rounded-lg px-2 text-xs font-bold text-[#8b6419] underline decoration-[#B88728]/50 underline-offset-4 transition-colors hover:text-[#6f4d0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] dark:text-[#F1C873] dark:hover:text-[#FFE3A0]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#E5B65F] px-5 text-sm font-bold text-[#171717] transition-colors hover:bg-[#f0c876] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f8fa] active:bg-[#d6a54d]"
              >
                <LockKeyhole size={16} aria-hidden="true" />
                Continue
              </button>

              <p
                className={`min-h-6 text-center text-xs leading-5 ${
                  notice ? (isLight ? 'text-amber-800' : 'text-[#F1C873]') : 'text-transparent'
                }`}
                role="status"
                aria-live="polite"
              >
                {notice || ' '}
              </p>
            </form>

            <div className={`mt-8 border-t pt-5 text-center text-[11px] leading-5 ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-white/45'}`}>
              Prototype only. No sign-in request is made and no account data is shown.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
