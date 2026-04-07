import { useState, useEffect } from 'react';
import { ALERTS } from '../data/mockData';

export default function Header({ user, firCount, zoneCount, alertCount, onLogout }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN', { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const tickText = ALERTS.join('  |  ') + '  |  ' + ALERTS.join('  |  ');

  return (
    <header className="hdr">
      <div className="logo-hex">🛡️</div>
      <div style={{ flexShrink: 0 }}>
        <div className="logo-name">REDSHIELD</div>
        <div className="logo-sub">CRIME PREDICTIVE INTELLIGENCE | CCTNS v3.0</div>
      </div>
      <div className="ticker-wrap">
        <span className="ticker-inner">{tickText}</span>
      </div>
      <div className="hpill"><div className="dot" />FIRs: <strong>{firCount}</strong></div>
      <div className="hpill"><div className="dot o" />Zones: <strong>{zoneCount}</strong></div>
      <div className="hpill"><div className="dot r" />Alerts: <strong>{alertCount}</strong></div>
      <div className="live-pill">● LIVE</div>
      <div className="hdr-time">{time}</div>
      <div className="user-pill">
        <div className="user-avatar">{user.badge}</div>
        <span style={{ fontSize: '11px' }}>{user.name.split(' ')[0]}</span>
        <span style={{ fontSize: '9px', color: '#475569' }}>{user.rank}</span>
      </div>
      <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
    </header>
  );
}
