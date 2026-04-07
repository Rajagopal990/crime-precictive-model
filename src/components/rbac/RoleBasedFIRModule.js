import { useMemo, useState } from 'react';
import rbacApi from '../../services/rbacApi';

function RoleBadge({ role }) {
  const label = role === 'admin' ? 'Admin' : role === 'police_officer' ? 'Police Officer' : 'Public User';
  return <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">{label}</span>;
}

function AuthPanel({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('public_user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        await rbacApi.post('/auth/register', { name, email, password, role });
      }
      const { data } = await rbacApi.post('/auth/login', { email, password });
      localStorage.setItem('rbac_jwt', data.token);
      onLogin({ role: data.role, name: data.name });
    } catch (e) {
      setError(e?.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex gap-2">
        <button className={`rounded-xl px-3 py-2 text-sm ${mode === 'login' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border border-slate-300'}`} onClick={() => setMode('login')} type="button">Login</button>
        <button className={`rounded-xl px-3 py-2 text-sm ${mode === 'register' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border border-slate-300'}`} onClick={() => setMode('register')} type="button">Register</button>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {mode === 'register' && <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />}
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'register' && (
          <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="public_user">Public User</option>
            <option value="police_officer">Police Officer</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>}
      <button className="mt-3 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white" onClick={submit} disabled={loading} type="button">{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register & Login'}</button>
    </div>
  );
}

function AdminView() {
  const [complaints, setComplaints] = useState([]);
  const [firs, setFirs] = useState([]);
  const [officerId, setOfficerId] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState('');
  const [statusFirId, setStatusFirId] = useState('');
  const [status, setStatus] = useState('under investigation');

  const load = async () => {
    const [c, f] = await Promise.all([rbacApi.get('/complaints?all=true'), rbacApi.get('/firs')]);
    setComplaints(c.data || []);
    setFirs(f.data || []);
  };

  const assign = async () => {
    if (!selectedComplaint || !officerId) return;
    await rbacApi.put(`/complaints/${selectedComplaint}/assign`, { officer_id: Number(officerId) });
    await load();
  };

  const updateStatus = async () => {
    if (!statusFirId) return;
    await rbacApi.put(`/fir/${statusFirId}/status`, { status });
    await load();
  };

  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white dark:bg-cyan-500 dark:text-slate-950" onClick={load} type="button">Refresh Admin Data</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Complaint ID" value={selectedComplaint} onChange={(e) => setSelectedComplaint(e.target.value)} />
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Officer User ID" value={officerId} onChange={(e) => setOfficerId(e.target.value)} />
        <button className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white" onClick={assign} type="button">Assign Complaint</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="FIR ID" value={statusFirId} onChange={(e) => setStatusFirId(e.target.value)} />
        <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="under investigation">Under Investigation</option>
          <option value="closed">Closed</option>
        </select>
        <button className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white" onClick={updateStatus} type="button">Update FIR Status</button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Complaints: {complaints.length} | FIRs: {firs.length}</p>
    </div>
  );
}

function PoliceView() {
  const [complaintId, setComplaintId] = useState('');
  const [crimeType, setCrimeType] = useState('IPC-Theft');
  const [location, setLocation] = useState('T. Nagar PS - Sector 1');
  const [status, setStatus] = useState('pending');
  const [firs, setFirs] = useState([]);

  const createFir = async () => {
    if (!complaintId || !crimeType || !location) return;
    await rbacApi.post('/fir', {
      complaint_id: Number(complaintId),
      crime_type: crimeType,
      status,
      location,
      date: new Date().toISOString(),
    });
    const { data } = await rbacApi.get('/firs');
    setFirs(data || []);
  };

  const refresh = async () => {
    const { data } = await rbacApi.get('/firs');
    setFirs(data || []);
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Assigned Complaint ID" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} />
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Crime Type" value={crimeType} onChange={(e) => setCrimeType(e.target.value)} />
        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="under investigation">Under Investigation</option>
          <option value="closed">Closed</option>
        </select>
        <button className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white" onClick={createFir} type="button">Create FIR</button>
      </div>
      <button className="w-fit rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" onClick={refresh} type="button">View Assigned FIRs ({firs.length})</button>
    </div>
  );
}

function HeatmapPanel() {
  const [hotspots, setHotspots] = useState([]);

  const loadHotspots = async () => {
    const { data } = await rbacApi.get('/analytics/hotspots');
    setHotspots(data?.hotspots || []);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">FIR Hotspot Heatmap Data</p>
        <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700" onClick={loadHotspots} type="button">Load Heatmap</button>
      </div>
      <div className="mt-2 space-y-2">
        {hotspots.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No hotspot data loaded yet.</p>}
        {hotspots.slice(0, 8).map((h, idx) => (
          <div key={`${h.location}-${idx}`}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{h.location}</span>
              <span>{h.total}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-2 rounded-full ${h.risk === 'high' ? 'bg-red-500' : h.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, h.total * 10)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PublicView() {
  const [description, setDescription] = useState('Suspicious activity near bus stand.');
  const [location, setLocation] = useState('Velachery - Sector 3');
  const [complaints, setComplaints] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const submitComplaint = async () => {
    await rbacApi.post('/complaint', { description, location });
    const [c, a] = await Promise.all([rbacApi.get('/complaints'), rbacApi.get('/alerts/safety')]);
    setComplaints(c.data || []);
    setAlerts(a.data?.alerts || []);
  };

  return (
    <div className="grid gap-3">
      <textarea className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button className="w-fit rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white" onClick={submitComplaint} type="button">Submit Complaint</button>
      <p className="text-xs text-slate-500 dark:text-slate-400">Tracked complaints: {complaints.length} | Safety alerts: {alerts.length}</p>
    </div>
  );
}

export default function RoleBasedFIRModule() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('rbac_jwt');
    return token ? { role: 'public_user', name: 'User' } : null;
  });
  const [activeRole, setActiveRole] = useState('public_user');

  const roleView = useMemo(() => {
    if (!session) return null;
    const role = activeRole;
    if (role === 'admin') return <AdminView />;
    if (role === 'police_officer') return <PoliceView />;
    return <PublicView />;
  }, [session, activeRole]);

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold">Role-Based FIR Management Module</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complaint -> Admin Review -> Officer FIR -> Status Lifecycle with RBAC.</p>
        </div>
        {session && <RoleBadge role={activeRole} />}
      </div>

      {!session ? (
        <div className="mt-3"><AuthPanel onLogin={(next) => { setSession(next); setActiveRole(next.role); }} /></div>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className={`rounded-xl px-3 py-2 text-sm ${activeRole === 'admin' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border border-slate-300'}`} onClick={() => setActiveRole('admin')} type="button">Admin UI</button>
            <button className={`rounded-xl px-3 py-2 text-sm ${activeRole === 'police_officer' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border border-slate-300'}`} onClick={() => setActiveRole('police_officer')} type="button">Police UI</button>
            <button className={`rounded-xl px-3 py-2 text-sm ${activeRole === 'public_user' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border border-slate-300'}`} onClick={() => setActiveRole('public_user')} type="button">Public UI</button>
            <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm" onClick={() => { localStorage.removeItem('rbac_jwt'); setSession(null); }} type="button">Logout</button>
          </div>
          <div className="mt-3 grid gap-3">{roleView}<HeatmapPanel /></div>
        </>
      )}
    </div>
  );
}


