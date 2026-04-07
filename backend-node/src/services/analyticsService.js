function hotspotSummary(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const key = `${row.location}`;
    const current = grouped.get(key) || { location: row.location, total: 0, severe: 0 };
    current.total += 1;
    if ((row.status || '').toLowerCase() !== 'closed') {
      current.severe += 1;
    }
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      risk: item.severe >= 5 ? 'high' : item.severe >= 2 ? 'medium' : 'low',
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);
}

function predictCrimeRisk(fir) {
  const status = String(fir.status || '').toLowerCase();
  let score = 0.3;
  if (status === 'under investigation') score += 0.25;
  if (status === 'pending') score += 0.15;

  const text = `${fir.crime_type || ''} ${fir.location || ''}`.toLowerCase();
  if (text.includes('weapon') || text.includes('murder')) score += 0.25;
  if (text.includes('drug') || text.includes('assault')) score += 0.15;

  return Math.min(0.95, Number(score.toFixed(2)));
}

module.exports = { hotspotSummary, predictCrimeRisk };
