import { useState } from 'react';
import { POLICE_ACCOUNTS } from '../data/mockData';

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Signup fields
  const [sName, setSName] = useState('');
  const [sBadge, setSBadge] = useState('');
  const [sRank, setSRank] = useState('SI');
  const [sStation, setSStation] = useState('Central PS');
  const [sPass, setSPass] = useState('');
  const [sPass2, setSPass2] = useState('');
  const [signupMsg, setSignupMsg] = useState('');

  const handleLogin = () => {
    setError('');
    if (!badgeId || !password) { setError('Enter Badge ID and Password'); return; }
    setLoading(true);
    setTimeout(() => {
      const acc = POLICE_ACCOUNTS.find(a => a.id === badgeId.toUpperCase() && a.password === password);
      if (acc) { onLogin(acc); }
      else { setError('Invalid Badge ID or Password. Try demo accounts below.'); setLoading(false); }
    }, 800);
  };

  const handleSignup = () => {
    setSignupMsg('');
    if (!sName || !sBadge || !sPass) { setSignupMsg('error:Fill all required fields'); return; }
    if (sPass !== sPass2) { setSignupMsg('error:Passwords do not match'); return; }
    if (sPass.length < 4) { setSignupMsg('error:Password must be at least 4 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      const newAcc = { id: sBadge.toUpperCase(), name: sName, role: sRank + ' — ' + sStation, badge: sRank, rank: sRank, password: sPass, station: sStation, access: 'station' };
      POLICE_ACCOUNTS.push(newAcc);
      setSignupMsg('ok:Account created! You can now log in with Badge ID: ' + sBadge.toUpperCase());
      setLoading(false);
      setTimeout(() => { setTab('login'); setBadgeId(sBadge.toUpperCase()); setPassword(sPass); }, 1500);
    }, 1000);
  };

  const fillDemo = (acc) => { setBadgeId(acc.id); setPassword(acc.password); setTab('login'); };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-hex">🛡️</div>
          <div>
            <div className="login-brand">REDSHIELD</div>
            <div className="login-tagline">CRIME PREDICTIVE INTELLIGENCE SYSTEM v3.0</div>
          </div>
        </div>

        <div className="login-tabs">
          <button className={`ltab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>LOGIN</button>
          <button className={`ltab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>REGISTER</button>
        </div>

        {tab === 'login' && (
          <>
            {error && <div className="login-error">⚠️ {error}</div>}
            <div className="login-field">
              <label>Badge ID / Officer ID</label>
              <input value={badgeId} onChange={e => setBadgeId(e.target.value)} placeholder="e.g. SP001, SI001" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? '⏳ AUTHENTICATING...' : '🔐 LOGIN TO REDSHIELD'}
            </button>

            <div className="login-divider">DEMO ACCOUNTS</div>
            <div className="demo-accounts">
              <div className="demo-title">CLICK ANY ACCOUNT TO AUTO-FILL</div>
              {POLICE_ACCOUNTS.slice(0, 5).map(a => (
                <div className="demo-row" key={a.id} onClick={() => fillDemo(a)}>
                  <span className={`demo-badge ${a.rank === 'SP' ? 'badge-sp' : a.rank === 'CI' ? 'badge-co' : 'badge-si'}`}>{a.rank}</span>
                  <span className="demo-cred">{a.id} / {a.password}</span>
                  <span style={{ fontSize: '10px', color: '#475569' }}>{a.station}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'signup' && (
          <>
            {signupMsg && (
              <div className={signupMsg.startsWith('ok:') ? 'login-success' : 'login-error'}>
                {signupMsg.startsWith('ok:') ? '✅ ' : '⚠️ '}
                {signupMsg.replace(/^(ok|error):/, '')}
              </div>
            )}
            <div className="login-field"><label>Full Name *</label><input value={sName} onChange={e => setSName(e.target.value)} placeholder="Officer full name" /></div>
            <div className="login-field"><label>Badge ID *</label><input value={sBadge} onChange={e => setSBadge(e.target.value)} placeholder="e.g. SI003, HC004" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="login-field">
                <label>Rank</label>
                <select value={sRank} onChange={e => setSRank(e.target.value)}>
                  <option>HC</option><option>SI</option><option>CI</option><option>DSP</option><option>SP</option>
                </select>
              </div>
              <div className="login-field">
                <label>Station</label>
                <select value={sStation} onChange={e => setSStation(e.target.value)}>
                  <option>Central PS</option><option>Srirangam PS</option><option>Ariyamangalam PS</option><option>Woraiyur PS</option><option>Traffic PS</option>
                </select>
              </div>
            </div>
            <div className="login-field"><label>Password *</label><input type="password" value={sPass} onChange={e => setSPass(e.target.value)} placeholder="Min 4 characters" /></div>
            <div className="login-field"><label>Confirm Password *</label><input type="password" value={sPass2} onChange={e => setSPass2(e.target.value)} placeholder="Repeat password" /></div>
            <button className="login-btn" onClick={handleSignup} disabled={loading}>
              {loading ? '⏳ CREATING ACCOUNT...' : '✅ CREATE OFFICER ACCOUNT'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
