export default function StatCard({ title, value, tone }) {
  const toneMap = {
    red: 'from-red-500/95 via-red-500/90 to-red-700/95',
    orange: 'from-orange-400/95 via-orange-500/90 to-orange-700/95',
    green: 'from-emerald-400/95 via-emerald-500/90 to-emerald-700/95',
    blue: 'from-sky-400/95 via-sky-500/90 to-sky-700/95'
  };

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${toneMap[tone] || toneMap.blue} p-5 text-white shadow-lg ring-1 ring-white/15 animate-riseIn`}>
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/75">{title}</p>
      <p className="mt-3 text-3xl font-semibold sm:text-4xl">{value}</p>
    </div>
  );
}
