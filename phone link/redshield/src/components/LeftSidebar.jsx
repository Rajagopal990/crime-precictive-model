import { DB, CCFG } from '../data/mockData';

export default function LeftSidebar({ firs, filters, setFilters, onApply, onClear }) {
  const total = firs.length;
  const crit = firs.filter(f => f.severity >= 4).length;
  const arr = firs.filter(f => f.status === 'Arrested').length;
  const women = firs.filter(f => f.victim === 'Female' || f.victim === 'Minor').length;

  const counts = {};
  firs.forEach(f => { counts[f.crimeType] = (counts[f.crimeType] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxC = sorted[0]?.[1] || 1;

  const areas = {};
  firs.forEach(f => {
    if (!areas[f.area]) areas[f.area] = { c: 0, s: 0 };
    areas[f.area].c++;
    areas[f.area].s += f.severity;
  });
  const ranked = Object.entries(areas).sort((a, b) => b[1].s - a[1].s).slice(0, 6);
  const maxS = ranked[0]?.[1].s || 1;
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
  const cols = ['#ff2244', '#ff7c1f', '#fbbf24', '#94a3b8', '#94a3b8', '#94a3b8'];

  return (
    <aside className="sl">
      {/* FILTERS */}
      <div className="card">
        <div className="ct"><span>🔍</span> Filters</div>
        <div className="fg" style={{ marginBottom: 7 }}>
          <div className="fl">Crime Type</div>
          <select value={filters.crime} onChange={e => setFilters(f => ({ ...f, crime: e.target.value }))}>
            <option value="all">All Crime Types</option>
            {[...new Set(DB.map(x => x.crimeType))].sort().map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="fg" style={{ marginBottom: 7 }}>
          <div className="fl">Act / Law</div>
          <select value={filters.act} onChange={e => setFilters(f => ({ ...f, act: e.target.value }))}>
            <option value="all">All Acts</option>
            {['IPC', 'NDPS', 'Arms', 'Excise', 'SC/ST', 'Gambling'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="fg" style={{ marginBottom: 7 }}>
          <div className="fl">Min. Severity</div>
          <select value={filters.sev} onChange={e => setFilters(f => ({ ...f, sev: e.target.value }))}>
            <option value="0">All Levels</option>
            <option value="2">Medium (2+)</option>
            <option value="3">High (3+)</option>
            <option value="4">Critical (4+)</option>
            <option value="5">Extreme (5)</option>
          </select>
        </div>
        <div className="fg2" style={{ marginBottom: 9 }}>
          <div className="fg"><div className="fl">From</div><input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} /></div>
          <div className="fg"><div className="fl">To</div><input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} /></div>
        </div>
        <div className="fg2">
          <button className="btn-red" style={{ fontSize: '9px', padding: '8px' }} onClick={onApply}>✔ APPLY</button>
          <button className="btn-blue" style={{ fontSize: '9px', padding: '8px' }} onClick={onClear}>✖ CLEAR</button>
        </div>
      </div>

      {/* STATS */}
      <div className="card g">
        <div className="ct"><span>📊</span> Live Statistics</div>
        <div className="stats-g">
          <div className="stat b"><div className="sv b">{total}</div><div className="sl2">TOTAL FIRS</div></div>
          <div className="stat r"><div className="sv r">{crit}</div><div className="sl2">CRITICAL</div></div>
          <div className="stat g"><div className="sv g">{arr}</div><div className="sl2">ARRESTED</div></div>
          <div className="stat o"><div className="sv o">{women}</div><div className="sl2">WOMEN/CHILD</div></div>
        </div>
      </div>

      {/* HOTSPOT RANK */}
      <div className="card o">
        <div className="ct"><span>🏆</span> Hotspot Rank</div>
        {ranked.map(([area, d], i) => (
          <div className="rank-row" key={area}>
            <div className="rank-num" style={{ color: cols[i] }}>{medals[i]}</div>
            <div className="rank-area">
              <div className="rank-name">{area}</div>
              <div className="rank-count">{d.c} FIRs · Score {d.s}</div>
            </div>
            <div className="rank-bar-w">
              <div className="rank-bar-f" style={{ width: Math.round(d.s / maxS * 100) + '%', background: cols[i] }} />
            </div>
            <span style={{ fontSize: '11px', color: i < 2 ? '#ff2244' : i < 4 ? '#fbbf24' : '#00ff88', marginLeft: 4 }}>
              {i < 2 ? '↑↑' : i < 4 ? '↑' : '↓'}
            </span>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="card">
        <div className="ct"><span>📈</span> Crime Trend</div>
        <div className="bchart">
          {sorted.map(([t, c]) => {
            const cfg = CCFG[t] || { c: '#888' };
            return <div key={t} className="bar" style={{ background: cfg.c, height: Math.round(c / maxC * 100) + '%', opacity: .85 }} title={t + ': ' + c} />;
          })}
        </div>
        <div className="blabels">
          {sorted.map(([t]) => <div key={t} className="blbl">{t.split(' ')[0].substring(0, 6)}</div>)}
        </div>
      </div>

      {/* LEGEND */}
      <div className="card">
        <div className="ct"><span>🗺️</span> Legend</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 8 }}>
          {[['#0000ff', 'Very Low'], ['#00cc00', 'Low'], ['#ffff00', 'Moderate'], ['#ff6600', 'High'], ['#ff0000', 'Critical']].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#94a3b8' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
              {l}
            </span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[['#ff0000', 'Critical Zone'], ['#ff6600', 'High Risk'], ['#ffaa00', 'Moderate'], ['#00ff88', 'Low Risk']].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#94a3b8' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: c, opacity: .75, display: 'inline-block', flexShrink: 0 }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-hint"><span>↓ SCROLL FOR MORE</span></div>
    </aside>
  );
}
