export default function AlertsPanel({ alerts }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/90 p-4 shadow-sm dark:border-red-900/60 dark:bg-red-950/40">
      <h3 className="font-display text-lg font-semibold text-red-700 dark:text-red-300">High Crime Alerts</h3>
      <p className="mt-1 text-xs text-red-700/70 dark:text-red-300/70">Priority zones and incidents that may need immediate attention.</p>
      <div className="mt-3 space-y-2">
        {(alerts || []).length === 0 && <p className="rounded-2xl border border-dashed border-red-200 px-3 py-4 text-sm text-red-700/70 dark:border-red-900/60 dark:text-red-300/70">No active high-risk alerts.</p>}
        {(alerts || []).map((a, idx) => (
          <div key={idx} className="rounded-2xl border border-red-200 bg-white px-3 py-3 text-sm shadow-sm dark:border-red-900 dark:bg-red-900/30">
            <p className="font-medium">{a.message}</p>
            <p className="mt-1 text-xs text-red-800/75 dark:text-red-200/75">Risk Score: {a.risk_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
