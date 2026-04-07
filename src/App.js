import { useCallback, useEffect, useState } from 'react';
import { FiFilter, FiLogOut, FiMoon, FiRefreshCw, FiSun } from 'react-icons/fi';

import AlertsPanel from './components/AlertsPanel';
import ChatAssistant from './components/ChatAssistant';
import CrimeMap from './components/CrimeMap';
import FIRForm from './components/FIRForm';
import LoginPanel from './components/LoginPanel';
import OperationsPanel from './components/OperationsPanel';
import StatCard from './components/StatCard';
import TrendCharts from './components/TrendCharts';
import UploadBox from './components/UploadBox';
import RoleBasedFIRModule from './components/rbac/RoleBasedFIRModule';
import { CRIME_TYPE_OPTIONS, TAMIL_NADU_AREAS, TIME_SLOT_OPTIONS } from './constants/firOptions';
import useInterval from './hooks/useInterval';
import api from './services/api';

const EMPTY_FILTERS = {
  crime_type: '',
  police_station: '',
  from_date: '',
  to_date: '',
  time_slot: ''
};

const formatApiDetail = (detail) => {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg && Array.isArray(item?.loc)) {
          return `${item.loc.slice(1).join(' -> ') || 'field'}: ${item.msg}`;
        }
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join('; ');
  }
  if (typeof detail === 'object' && detail?.msg) return detail.msg;
  if (typeof detail === 'object') return JSON.stringify(detail);
  return String(detail);
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('crime_jwt'));
  const [authLoading, setAuthLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [predictResult, setPredictResult] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [backendReachable, setBackendReachable] = useState(true);
  const [incidentPoints, setIncidentPoints] = useState([]);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const resetSession = useCallback(() => {
    localStorage.removeItem('crime_jwt');
    setToken(null);
  }, []);

  const getApiErrorMessage = useCallback((e, fallbackMessage) => {
    if (e?.response?.status === 401) {
      return 'Your session expired. Please sign in again.';
    }
    if (e?.response?.data?.detail) {
      return formatApiDetail(e.response.data.detail);
    }
    if (!e?.response) return 'Cannot reach backend. Start the backend server on port 8000 and verify the API URL.';
    return fallbackMessage;
  }, []);

  const fetchDashboard = useCallback(
    async (isSilent = false) => {
      if (!token) return;
      if (!isSilent) {
        setDashboardLoading(true);
      }
      setError('');

      try {
        const params = {};
        if (appliedFilters.crime_type) params.crime_type = appliedFilters.crime_type;
        if (appliedFilters.police_station) params.police_station = appliedFilters.police_station;
        if (appliedFilters.from_date) params.from_date = new Date(`${appliedFilters.from_date}T00:00:00`).toISOString();
        if (appliedFilters.to_date) params.to_date = new Date(`${appliedFilters.to_date}T23:59:59`).toISOString();
        if (appliedFilters.time_slot) params.time_slot = appliedFilters.time_slot;

        const [dashboardResponse, firResponse] = await Promise.all([
          api.get('/analytics/dashboard', { params }),
          api.get('/firs', { params })
        ]);
        setDashboard(dashboardResponse.data);
        setIncidentPoints(firResponse.data || []);
        setLastUpdated(new Date());
        setBackendReachable(true);
      } catch (e) {
        if (!e?.response) {
          setBackendReachable(false);
        } else if (e.response.status === 401) {
          resetSession();
        }
        setError(getApiErrorMessage(e, 'Failed to load dashboard'));
      } finally {
        if (!isSilent) {
          setDashboardLoading(false);
        }
      }
    },
    [token, appliedFilters, getApiErrorMessage, resetSession]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token, fetchDashboard]);

  useInterval(
    () => {
      fetchDashboard(true).catch(() => null);
    },
    token && backendReachable ? 15000 : null
  );

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('crime_jwt', response.data.access_token);
      setToken(response.data.access_token);
      setBackendReachable(true);
    } catch (e) {
      setBackendReachable(Boolean(e?.response));
      setError(getApiErrorMessage(e, 'Authentication failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setAuthLoading(true);
    setError('');
    try {
      await api.post('/auth/register', payload);
      const response = await api.post('/auth/login', {
        username: payload.username,
        password: payload.password
      });
      localStorage.setItem('crime_jwt', response.data.access_token);
      setToken(response.data.access_token);
      setBackendReachable(true);
    } catch (e) {
      setBackendReachable(Boolean(e?.response));
      setError(getApiErrorMessage(e, 'Registration failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const submitFIR = async (payload) => {
    setActionLoading(true);
    setError('');
    try {
      await api.post('/firs', payload);
      const prediction = await api.post('/firs/predict', payload);
      setPredictResult(prediction.data);
      await fetchDashboard();
    } catch (e) {
      if (!e?.response) {
        setBackendReachable(false);
      }
      setError(getApiErrorMessage(e, 'Could not submit FIR'));
    } finally {
      setActionLoading(false);
    }
  };

  const uploadFIRs = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setActionLoading(true);
    setError('');

    try {
      await api.post('/firs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchDashboard();
    } catch (e) {
      if (!e?.response) {
        setBackendReachable(false);
      }
      setError(getApiErrorMessage(e, 'Upload failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const askAssistant = async (query) => {
    try {
      const response = await api.post('/assistant/chat', { query });
      setBackendReachable(true);
      return response.data.response;
    } catch {
      setBackendReachable(false);
      return 'Assistant is currently unavailable.';
    }
  };

  const filteredHotspots = dashboard?.hotspots || [];

  if (!token) {
    return <LoginPanel onLogin={handleLogin} onRegister={handleRegister} loading={authLoading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.09),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold sm:text-xl">Crime Predictive Model & Hotspot Mapping System</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Automated FIR intelligence, forecasting, and patrol planning</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={() => {
                setBackendReachable(true);
                fetchDashboard();
              }}
              disabled={dashboardLoading}
            >
              <FiRefreshCw className={dashboardLoading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={() => setDarkMode((v) => !v)}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={() => resetSession()}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
        {!backendReachable && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            Backend is offline. Start `python -m uvicorn backend.app.main:app --reload --port 8000`, then press Refresh.
          </p>
        )}
        {actionLoading && <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">Processing request...</p>}

        <div className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/65 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : 'Waiting for data'}
          </p>
          {dashboardLoading && <p className="text-xs text-slate-500 dark:text-slate-400">Loading dashboard...</p>}
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <StatCard title="Total Crimes" value={dashboard?.summary?.total_crimes || 0} tone="red" />
          <StatCard title="Last 30 Days" value={dashboard?.summary?.last_30_days || 0} tone="orange" />
          <StatCard title="High Hotspots" value={dashboard?.summary?.high_hotspots || 0} tone="green" />
          <StatCard title="Patrol Risk Weight" value={dashboard?.patrol_route?.risk_weight || 0} tone="blue" />
        </div>


        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <CrimeMap
              hotspots={filteredHotspots}
              womenSafety={dashboard?.women_safety || []}
              accidents={dashboard?.accident_clusters || []}
              patrolRoute={dashboard?.patrol_route || {}}
              riskZones={dashboard?.risk_zones || []}
              incidents={incidentPoints}
            />
            <TrendCharts behavior={dashboard?.behavior || {}} />
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <h3 className="font-display text-lg font-semibold">Filters</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Filter by crime type, crime time, date window, and Tamil Nadu police station.</p>
              <div className="mt-4 space-y-2">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  value={filters.crime_type}
                  onChange={(e) => setFilters((v) => ({ ...v, crime_type: e.target.value }))}
                >
                  {CRIME_TYPE_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  value={filters.police_station}
                  onChange={(e) => setFilters((v) => ({ ...v, police_station: e.target.value }))}
                >
                  <option value="">All Tamil Nadu areas</option>
                  {TAMIL_NADU_AREAS.map((area) => (
                    <option key={area.policeStation} value={area.policeStation}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  value={filters.time_slot}
                  onChange={(e) => setFilters((v) => ({ ...v, time_slot: e.target.value }))}
                >
                  {TIME_SLOT_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  value={filters.from_date}
                  onChange={(e) => setFilters((v) => ({ ...v, from_date: e.target.value }))}
                />
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  value={filters.to_date}
                  onChange={(e) => setFilters((v) => ({ ...v, to_date: e.target.value }))}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  onClick={() => setAppliedFilters(filters)}
                >
                  <FiFilter /> Apply
                </button>
                <button
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  onClick={() => {
                    setFilters(EMPTY_FILTERS);
                    setAppliedFilters(EMPTY_FILTERS);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <AlertsPanel alerts={dashboard?.alerts || []} />
            <ChatAssistant onAsk={askAssistant} />
          </div>
        </div>

        <OperationsPanel
          distribution={dashboard?.risk_distribution || {}}
          updates={dashboard?.live_updates || []}
          suggestions={dashboard?.patrol_suggestions || []}
          zones={dashboard?.risk_zones || []}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <FIRForm onSubmit={submitFIR} predictResult={predictResult} />
          <UploadBox onUpload={uploadFIRs} />
        </div>

        <RoleBasedFIRModule />
      </main>
    </div>
  );
}

export default App;




















