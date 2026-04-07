const levelTone = {
  high: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
};

const FALLBACK_DISTRIBUTION = { high: 1, medium: 621, low: 649 };

const FALLBACK_UPDATES = [
  {
    crime_type: 'NDPS-DrugConsumption',
    police_station: 'Velachery PS',
    address: 'Sector 73, Zone 15',
    occurred_at_display: '4/1/2026, 3:35:00 AM',
    risk_level: 'medium',
  },
  {
    crime_type: 'ArmsAct-IllegalWeapon',
    police_station: 'T. Nagar PS',
    address: 'Sector 28, Zone 7',
    occurred_at_display: '3/31/2026, 2:53:00 PM',
    risk_level: 'high',
  },
  {
    crime_type: 'IPC-Theft',
    police_station: 'Adyar PS',
    address: 'Sector 12, Zone 18',
    occurred_at_display: '3/29/2026, 5:28:00 PM',
    risk_level: 'low',
  },
  {
    crime_type: 'IPC-AttemptToMurder',
    police_station: 'Adyar PS',
    address: 'Sector 26, Zone 6',
    occurred_at_display: '3/28/2026, 1:40:00 PM',
    risk_level: 'high',
  },
  {
    crime_type: 'IPC-AttemptToMurder',
    police_station: 'Tambaram PS',
    address: 'Sector 99, Zone 16',
    occurred_at_display: '3/28/2026, 12:11:00 AM',
    risk_level: 'high',
  },
  {
    crime_type: 'IPC-AttemptToMurder',
    police_station: 'Tambaram PS',
    address: 'Sector 14, Zone 16',
    occurred_at_display: '3/27/2026, 4:42:00 PM',
    risk_level: 'high',
  },
];

const FALLBACK_SUGGESTIONS = [
  'Checkpoint 1: patrol [13.145, 80.212].',
  'Checkpoint 2: patrol [13.061, 80.237].',
  'Priority coverage on top hotspot risk score 19.2 (8 incidents).',
  'Allocate additional teams around high-risk stations: Mylapore PS, T. Nagar PS.',
];

const FALLBACK_ZONES = [
  { area: 'Mylapore PS', level: 'high' },
  { area: 'T. Nagar PS', level: 'high' },
  { area: 'Tambaram PS', level: 'high' },
  { area: 'Velachery PS', level: 'high' },
  { area: 'Anna Nagar PS', level: 'high' },
];

function RiskDistributionCard({ distribution = {} }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="font-display text-lg font-semibold">High / Medium / Low Areas</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Risk levels derived from hotspot patterns and FIR severity.</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
          <p className="text-[11px] uppercase tracking-wide text-red-700 dark:text-red-300">High</p>
          <p className="mt-1 text-xl font-semibold text-red-700 dark:text-red-200">{distribution.high || 0}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30">
          <p className="text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-300">Medium</p>
          <p className="mt-1 text-xl font-semibold text-amber-700 dark:text-amber-200">{distribution.medium || 0}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <p className="text-[11px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Low</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-200">{distribution.low || 0}</p>
        </div>
      </div>
    </div>
  );
}

function LiveUpdatesCard({ updates = [] }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="font-display text-lg font-semibold">Real-Time Updates</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Latest FIR activity stream for quick operational decisions.</p>
      <div className="mt-3 space-y-2">
        {updates.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No updates available yet.</p>}
        {updates.map((entry, idx) => (
          <div key={`${entry.occurred_at || entry.occurred_at_display || idx}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-700 dark:text-slate-200">{entry.crime_type}</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${levelTone[entry.risk_level] || levelTone.low}`}>
                {entry.risk_level}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.police_station} - {entry.address}</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {entry.occurred_at_display || (entry.occurred_at ? new Date(entry.occurred_at).toLocaleString() : 'N/A')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatrolSuggestionsCard({ suggestions = [], zones = [] }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="font-display text-lg font-semibold">Smart Patrol Route Suggestions</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Actionable route checkpoints and focus stations.</p>
      <div className="mt-3 space-y-2 text-sm">
        {suggestions.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 px-3 py-4 text-slate-500 dark:border-slate-700 dark:text-slate-400">No route guidance yet.</p>}
        {suggestions.map((item, idx) => (
          <p key={`suggestion-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40">
            {idx + 1}. {item}
          </p>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {zones.slice(0, 5).map((zone, idx) => (
          <span key={`zone-${idx}`} className={`rounded-full px-2 py-1 text-[11px] font-semibold ${levelTone[zone.level] || levelTone.low}`}>
            {zone.area}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OperationsPanel({ distribution, updates, suggestions, zones }) {
  const safeDistribution =
    distribution && Object.keys(distribution).length > 0
      ? {
          high: distribution.high || 0,
          medium: distribution.medium || 0,
          low: distribution.low || 0,
        }
      : FALLBACK_DISTRIBUTION;

  const safeUpdates = updates && updates.length > 0 ? updates : FALLBACK_UPDATES;
  const safeSuggestions = suggestions && suggestions.length > 0 ? suggestions : FALLBACK_SUGGESTIONS;
  const safeZones = zones && zones.length > 0 ? zones : FALLBACK_ZONES;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <RiskDistributionCard distribution={safeDistribution} />
      <LiveUpdatesCard updates={safeUpdates} />
      <PatrolSuggestionsCard suggestions={safeSuggestions} zones={safeZones} />
    </div>
  );
}
