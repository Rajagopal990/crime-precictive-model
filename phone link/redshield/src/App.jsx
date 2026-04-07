import { useState, useEffect, useCallback } from 'react';
import { DB } from './data/mockData';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import MapView from './components/MapView';
import RightSidebar from './components/RightSidebar';
import Notifications from './components/Notifications';

export default function App() {
  const [user, setUser] = useState(null);
  const [firs, setFirs] = useState([...DB]);
  const [view, setView] = useState('heatmap');
  const [notifs, setNotifs] = useState([]);
  const [alertCount, setAlertCount] = useState(3);
  const [filters, setFilters] = useState({
    crime: 'all', act: 'all', sev: '0',
    from: '2023-01-01', to: '2025-12-31'
  });
  const [activeFilters, setActiveFilters] = useState({
    crime: 'all', act: 'all', sev: '0',
    from: '2023-01-01', to: '2025-12-31'
  });

  const addNotif = useCallback((title, msg, type = 'ok') => {
    const id = Date.now();
    setNotifs(n => [...n, { id, title, msg, type }]);
    setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 4500);
  }, []);

  // Random alert count cycling
  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => setAlertCount(Math.floor(Math.random() * 4) + 2), 9000);
    return () => clearInterval(t);
  }, [user]);

  // Live FIR simulation (30s after login)
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      const simFir = {
        id: 'FIR-LIVE-' + Date.now(),
        ipc: '392', act: 'IPC', crimeType: 'Robbery',
        lat: 10.795 + ((Math.random() - .5) * .02),
        lng: 78.705 + ((Math.random() - .5) * .02),
        area: 'Srirangam', ps: 'Srirangam PS',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        severity: 4, victim: 'Male', accused: 'Unknown', status: 'Under Investigation'
      };
      setFirs(prev => [...prev, simFir]);
      if (window._rsAddMarker) window._rsAddMarker(simFir);
      addNotif('🔴 LIVE FIR RECEIVED', 'Robbery at Srirangam — Immediate Response Required', 'err');
      setAlertCount(a => a + 1);
    }, 30000);
    return () => clearTimeout(t);
  }, [user, addNotif]);

  // Filtered FIRs
  const filteredFirs = firs.filter(f => {
    if (activeFilters.crime !== 'all' && f.crimeType !== activeFilters.crime) return false;
    if (activeFilters.act !== 'all' && f.act !== activeFilters.act) return false;
    if (activeFilters.sev !== '0' && f.severity < parseInt(activeFilters.sev)) return false;
    if (activeFilters.from && f.date < activeFilters.from) return false;
    if (activeFilters.to && f.date > activeFilters.to) return false;
    return true;
  });

  const applyFilters = () => {
    setActiveFilters({ ...filters });
    addNotif('✅ Filters Applied', `Showing ${filteredFirs.length} records`, 'ok');
  };

  const clearFilters = () => {
    const d = { crime: 'all', act: 'all', sev: '0', from: '2023-01-01', to: '2025-12-31' };
    setFilters(d);
    setActiveFilters(d);
  };

  const exportCSV = () => {
    const rows = ['FIR ID,Crime Type,Act,IPC,Area,PS,Date,Time,Severity,Status,Victim,Lat,Lng']
      .concat(filteredFirs.map(f =>
        `${f.id},${f.crimeType},${f.act},${f.ipc},${f.area},${f.ps},${f.date},${f.time},${f.severity},${f.status},${f.victim || 'N/A'},${f.lat},${f.lng}`
      ));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    a.download = 'REDSHIELD_v3_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    addNotif('📥 Export Done', filteredFirs.length + ' records exported', 'info');
  };

  const zoneCount = [...new Set(filteredFirs.map(f => f.area))].length;

  if (!user) {
    return (
      <LoginPage
        onLogin={(acc) => {
          setUser(acc);
          addNotif(`✅ Welcome, ${acc.name}`, `Logged in as ${acc.role} — ${acc.station}`, 'ok');
        }}
      />
    );
  }

  return (
    <div className="app">
      <Notifications notifs={notifs} />
      <Header
        user={user}
        firCount={filteredFirs.length}
        zoneCount={zoneCount}
        alertCount={alertCount}
        onLogout={() => { setUser(null); setFirs([...DB]); }}
      />
      <div className="body-wrap">
        <LeftSidebar
          firs={filteredFirs}
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />
        <MapView
          firs={filteredFirs}
          view={view}
          setView={setView}
          onExport={exportCSV}
        />
        <RightSidebar
          firs={filteredFirs}
          setFirs={setFirs}
          addNotif={addNotif}
          setView={setView}
        />
      </div>
    </div>
  );
}
