import { useMemo, useState } from 'react';

const initialLoginForm = { username: 'admin', password: 'Admin@123' };
const initialRegisterForm = { username: '', password: '', role: 'officer' };

export default function LoginPanel({ onLogin, onRegister, loading, error }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  const helperText = useMemo(() => {
    if (mode === 'register') {
      return 'Create an officer or admin account for the control room dashboard';
    }
    return 'Secure police analytics access';
  }, [mode]);

  const submitLabel = loading
    ? mode === 'register'
      ? 'Creating account...'
      : 'Signing in...'
    : mode === 'register'
      ? 'Create Account'
      : 'Sign In';

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.18),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] p-6 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden lg:block">
          <p className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">Secure Dashboard</p>
          <h1 className="mt-6 max-w-xl font-display text-5xl font-bold leading-tight">Crime intelligence built for real-time police operations.</h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300">Monitor hotspots, review alerts, upload FIR data, and coordinate safer patrol decisions from one control room interface.</p>
        </div>
        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <h2 className="mt-6 font-display text-2xl font-bold">{mode === 'register' ? 'Create Account' : 'Sign In'}</h2>
          <p className="mt-2 text-sm text-slate-300">{helperText}</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === 'register') {
                onRegister(registerForm);
                return;
              }
              onLogin(loginForm);
            }}
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Username</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-sm"
                value={mode === 'register' ? registerForm.username : loginForm.username}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (mode === 'register') {
                    setRegisterForm((v) => ({ ...v, username: nextValue }));
                    return;
                  }
                  setLoginForm((v) => ({ ...v, username: nextValue }));
                }}
                placeholder="Username"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Password</span>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-sm"
                value={mode === 'register' ? registerForm.password : loginForm.password}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (mode === 'register') {
                    setRegisterForm((v) => ({ ...v, password: nextValue }));
                    return;
                  }
                  setLoginForm((v) => ({ ...v, password: nextValue }));
                }}
                placeholder="Password"
              />
            </label>

            {mode === 'register' ? (
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</span>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-sm"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm((v) => ({ ...v, role: e.target.value }))}
                >
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            ) : (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-xs text-cyan-100">
                Default accounts: admin / Admin@123 and officer / Officer@123
              </div>
            )}

            {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

            <button
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
