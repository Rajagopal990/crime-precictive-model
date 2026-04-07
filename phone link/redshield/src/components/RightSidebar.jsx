import { useState, useEffect, useRef } from 'react';
import { CCFG, AREA_COORDS, IPC_REF, PATROL_UNITS } from '../data/mockData';

export default function RightSidebar({ firs, setFirs, addNotif, setView }) {
  const [rTab, setRTab] = useState('new');
  const [sosActive, setSosActive] = useState(false);
  const [dispatch, setDispatch] = useState(null);
  const [aiMsgs, setAiMsgs] = useState([{ role: 'bot', text: 'Hello Officer! Ask me about crime patterns, hotspots, or predictions for Tiruchirapalli.' }]);
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [weather, setWeather] = useState(null);
  const [ipcSearch, setIpcSearch] = useState('');
  const [pred, setPred] = useState([]);
  const aiChatRef = useRef(null);

  const [form, setForm] = useState({
    act: 'IPC', ipc: '', crime: '', area: '', ps: 'Central PS',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().substring(0, 5),
    lat: '', lng: '', victim: '', sev: '3', accused: ''
  });

  // Real-time predictions
  useEffect(() => {
    const calc = (w) => {
      const h = new Date().getHours(), mo = new Date().getMonth(), dow = new Date().getDay();
      const night = h >= 20 || h <= 6, lateNight = h >= 22 || h <= 4, earlyMorn = h >= 4 && h <= 8;
      const summer = mo >= 3 && mo <= 7, winter = mo >= 11 || mo <= 1, weekend = dow === 0 || dow === 6;
      const temp = w ? w.temp : 30, hum = w ? w.hum : 65, rain = w ? w.rain : false;
      const hF = Math.max(0, Math.min(28, (temp - 22) * 2.2)), humF = hum > 75 ? 12 : hum > 60 ? 5 : 0;
      return [
        { l: 'Theft', pct: Math.min(98, Math.round((lateNight ? 84 : night ? 69 : 35) + (weekend ? 8 : 0) + (rain ? -5 : 0))), c: '#DAA520' },
        { l: 'Robbery', pct: Math.min(98, Math.round((lateNight ? 76 : night ? 61 : 22) + (weekend ? 10 : 0) + hF * .4)), c: '#FFA500' },
        { l: 'Harassment', pct: Math.min(98, Math.round((night ? 63 : 29) + hF * .5 + (weekend ? 12 : 0))), c: '#FF1493' },
        { l: 'Drug Activity', pct: Math.min(98, Math.round((lateNight ? 71 : night ? 59 : 35) + (summer ? 14 : 0))), c: '#9400D3' },
        { l: 'Domestic Viol', pct: Math.min(98, Math.round(42 + (night ? 12 : 0) + (winter ? 10 : 0) + (weekend ? 8 : 0))), c: '#FF69B4' },
        { l: 'Road Accident', pct: Math.min(98, Math.round((earlyMorn ? 82 : lateNight ? 76 : 36) + (rain ? 18 : 0))), c: '#00CED1' },
        { l: 'Public Disorder', pct: Math.min(98, Math.round(15 + hF * .8 + humF * .5 + (weekend ? 10 : 0))), c: '#ff2244' },
      ];
    };
    const update = () => setPred(calc(weather));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, [weather]);

  // Fetch live weather from Open-Meteo
  useEffect(() => {
    const fetchW = async () => {
      try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.7905&longitude=78.7047&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,apparent_temperature&wind_speed_unit=kmh&timezone=Asia%2FKolkata');
        const d = await r.json();
        const c = d.current;
        setWeather({ temp: Math.round(c.temperature_2m), hum: Math.round(c.relative_humidity_2m), feels: Math.round(c.apparent_temperature), wind: Math.round(c.wind_speed_10m), rain: c.precipitation > 0 || c.weather_code >= 61, code: c.weather_code, src: 'LIVE' });
      } catch (e) {
        const mo = new Date().getMonth(), hot = mo >= 3 && mo <= 8;
        setWeather({ temp: hot ? 31 : 24, hum: hot ? 68 : 55, feels: hot ? 33 : 25, wind: 10, rain: false, code: 1, src: 'EST' });
      }
    };
    fetchW();
    const t = setInterval(fetchW, 600000);
    return () => clearInterval(t);
  }, []);

  const wIcon = weather ? (weather.code >= 95 ? '⛈️' : weather.code >= 61 ? '🌧️' : weather.code >= 3 ? '⛅' : weather.code >= 1 ? '🌤️' : '☀️') : '...';

  // Live preview on map when form changes
  useEffect(() => {
    if (!form.crime) return;
    const ac = AREA_COORDS[form.area];
    const lat = form.lat ? parseFloat(form.lat) : ac?.lat;
    const lng = form.lng ? parseFloat(form.lng) : ac?.lng;
    if (lat && lng && window._rsPreview) window._rsPreview(lat, lng, form.crime, parseInt(form.sev) || 3, form.area);
  }, [form.crime, form.area, form.sev, form.lat, form.lng]);

  const handleAreaChange = (area) => {
    const ac = AREA_COORDS[area];
    setForm(f => ({ ...f, area, lat: ac ? String(ac.lat) : '', lng: ac ? String(ac.lng) : '' }));
  };

  const submitFIR = () => {
    if (!form.ipc || !form.crime || !form.area) { addNotif('❌ Error', 'Fill Section, Crime Type and Area', 'err'); return; }
    const ac = AREA_COORDS[form.area] || { lat: 10.7905 + ((Math.random() - .5) * .04), lng: 78.7047 + ((Math.random() - .5) * .04) };
    const fir = {
      id: 'FIR-' + new Date().getFullYear() + '-' + String(firs.length + 1).padStart(3, '0'),
      ipc: form.ipc, act: form.act, crimeType: form.crime, area: form.area, ps: form.ps,
      date: form.date || new Date().toISOString().split('T')[0],
      time: form.time || new Date().toTimeString().substring(0, 5),
      lat: form.lat && !isNaN(parseFloat(form.lat)) ? parseFloat(form.lat) : ac.lat,
      lng: form.lng && !isNaN(parseFloat(form.lng)) ? parseFloat(form.lng) : ac.lng,
      severity: parseInt(form.sev) || 3, victim: form.victim || '', accused: form.accused || 'Unknown', status: 'Under Investigation'
    };
    setFirs(prev => [...prev, fir]);
    if (window._rsAddMarker) window._rsAddMarker(fir);
    if (window._rsMap) window._rsMap.flyTo([fir.lat, fir.lng], 15, { duration: 1 });
    addNotif('✅ FIR Registered — MAP UPDATED', `${fir.id} · ${form.crime} at ${form.area}`, 'ok');
    setForm(f => ({ ...f, ipc: '', crime: '', area: '', accused: '', lat: '', lng: '' }));
  };

  const triggerSOS = () => {
    if (sosActive) { setSosActive(false); setDispatch(null); return; }
    setSosActive(true);
    setTimeout(() => {
      const units = ['PCR-01', 'PCR-02', 'MTR-01', 'WOMEN-01'];
      const unit = units[Math.floor(Math.random() * units.length)];
      const areas = ['Srirangam', 'Thillai Nagar', 'Woraiyur', 'Palakarai'];
      const eta = Math.floor(Math.random() * 5) + 3;
      setDispatch({ unit, eta, loc: areas[Math.floor(Math.random() * areas.length)] });
      addNotif('🚨 DISPATCH CONFIRMED', `Unit ${unit} en route — ETA ${eta} min`, 'err');
    }, 2000);
  };

  const sendAI = () => {
    const q = aiInput.trim(); if (!q) return;
    setAiMsgs(m => [...m, { role: 'user', text: q }]);
    setAiInput(''); setAiThinking(true);
    setTimeout(() => {
      const ql = q.toLowerCase();
      const areas2 = {}; firs.forEach(f => { if (!areas2[f.area]) areas2[f.area] = 0; areas2[f.area]++; });
      const topArea = Object.entries(areas2).sort((a, b) => b[1] - a[1])[0];
      const types2 = {}; firs.forEach(f => { if (!types2[f.crimeType]) types2[f.crimeType] = 0; types2[f.crimeType]++; });
      const topType = Object.entries(types2).sort((a, b) => b[1] - a[1])[0];
      const nightC = firs.filter(f => { const h = parseInt(f.time.split(':')[0]); return h >= 20 || h <= 6; }).length;
      const arrC = firs.filter(f => f.status === 'Arrested').length;
      const womenC = firs.filter(f => f.victim === 'Female' || f.victim === 'Minor').length;
      let reply = `🤖 Analysis on ${firs.length} FIRs: Crime index = ${Math.round(firs.reduce((a, f) => a + f.severity, 0) / firs.length * 20)}/100. Top concern: ${topType?.[0]}. Ask me about areas, peak times, predictions, or patrol recommendations.`;
      if (ql.includes('danger') || ql.includes('worst') || ql.includes('most crime')) reply = `📊 ${topArea?.[0]} leads with ${topArea?.[1]} FIRs (${Math.round((topArea?.[1] || 0) / firs.length * 100)}% of all crime). Recommend dense patrol coverage, especially 8 PM–2 AM. Second highest: check Rank panel on left.`;
      else if (ql.includes('theft') || ql.includes('common')) reply = `🔍 Most common crime: ${topType?.[0]} (${topType?.[1]} cases, ${Math.round((topType?.[1] || 0) / firs.length * 100)}%). Suggest community awareness + property marking drives. Evening hours 6–10 PM are peak time.`;
      else if (ql.includes('night') || ql.includes('time') || ql.includes('when')) reply = `⏰ ${nightC} of ${firs.length} crimes (${Math.round(nightC / firs.length * 100)}%) occur 8 PM–6 AM. Critical window: 10 PM–2 AM. Deploy additional night shift units PCR-01 and MTR-01.`;
      else if (ql.includes('women') || ql.includes('female') || ql.includes('safety')) reply = `👩 ${womenC} incidents involve women/minors. Primary risk areas: K.K. Nagar, Woraiyur, Thillai Nagar. Activate WOMEN-01 patrol route. Install CCTVs at bus stops and deserted roads.`;
      else if (ql.includes('predict') || ql.includes('forecast') || ql.includes('next')) reply = `🔮 Prediction: 15–20% theft spike expected next month. Drug activity peaks during summer evenings (Apr–Jul). Pre-emptive raids recommended in Kattur corridor. Reinforce NH-67 patrol on weekends.`;
      else if (ql.includes('arrest') || ql.includes('solved')) reply = `✅ Arrest rate: ${arrC}/${firs.length} = ${Math.round(arrC / firs.length * 100)}%. National average is 44%. Performance: ${Math.round(arrC / firs.length * 100) >= 44 ? 'ABOVE' : 'BELOW'} average. Focus: improve drug trafficking investigation closure rate.`;
      else if (ql.includes('drug') || ql.includes('ndps')) reply = `💊 ${firs.filter(f => f.act === 'NDPS').length} NDPS cases. Hotspot: Kattur-Ariyamangalam corridor. Peak time: 10 PM–2 AM. Recommend joint raid with STF on NH-67 entry points.`;
      else if (ql.includes('weather') || ql.includes('temp')) reply = `🌡️ Current: ${weather?.temp || '—'}°C, ${weather?.hum || '—'}% humidity. ${(weather?.temp || 30) >= 32 ? 'HIGH HEAT increases aggression by ~40%.' : weather?.rain ? 'Rain conditions increase accident risk by ~45%.' : 'Moderate conditions — normal patrol protocol.'}`;
      setAiMsgs(m => [...m, { role: 'bot', text: reply }]);
      setAiThinking(false);
    }, 1200 + Math.random() * 600);
  };

  // Auto-scroll AI chat
  useEffect(() => {
    if (aiChatRef.current) aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
  }, [aiMsgs, aiThinking]);

  const ipcFiltered = ipcSearch
    ? IPC_REF.filter(i => i.s.includes(ipcSearch) || i.d.toLowerCase().includes(ipcSearch.toLowerCase()))
    : IPC_REF;

  return (
    <aside className="sr">
      {/* SOS */}
      <div className="card r">
        <div className="ct"><span>🚨</span> Emergency Dispatch</div>
        <button className={`sos-btn ${sosActive ? 'active' : ''}`} onClick={triggerSOS}>
          {sosActive && !dispatch ? '🔴 DISPATCHING...' : sosActive && dispatch ? '✅ UNIT DISPATCHED — TAP TO CANCEL' : '🚨 SOS — DISPATCH NOW'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '9px', color: '#475569', fontFamily: 'Share Tech Mono,monospace', marginTop: 5 }}>
          {dispatch ? `Unit ${dispatch.unit} EN ROUTE — ETA ${dispatch.eta} min` : 'CLICK TO DISPATCH NEAREST PATROL UNIT'}
        </div>
        {dispatch && (
          <div className="dispatch-info">
            <div className="di-row"><span>Unit</span><span>{dispatch.unit}</span></div>
            <div className="di-row"><span>ETA</span><span>{dispatch.eta} min</span></div>
            <div className="di-row"><span>Location</span><span>{dispatch.loc}</span></div>
            <div className="di-row"><span>Status</span><span>EN ROUTE ●</span></div>
          </div>
        )}
      </div>

      {/* FIR FORM */}
      <div className="card r">
        <div className="ct"><span>📝</span> Register FIR</div>
        <div className="tabs">
          <button className={`tab ${rTab === 'new' ? 'active' : ''}`} onClick={() => setRTab('new')}>NEW FIR</button>
          <button className={`tab ${rTab === 'rec' ? 'active' : ''}`} onClick={() => setRTab('rec')}>RECENT</button>
        </div>

        {rTab === 'new' && (
          <>
            <div className="fg2" style={{ marginBottom: 7 }}>
              <div className="fg">
                <div className="fl">Act *</div>
                <select value={form.act} onChange={e => setForm(f => ({ ...f, act: e.target.value }))}>
                  {['IPC', 'NDPS', 'Arms', 'Excise', 'SC/ST', 'Gambling'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Section *</div>
                <input type="text" value={form.ipc} onChange={e => setForm(f => ({ ...f, ipc: e.target.value }))} placeholder="e.g. 302" />
              </div>
            </div>
            <div className="fg" style={{ marginBottom: 7 }}>
              <div className="fl">Crime Type *</div>
              <select value={form.crime} onChange={e => setForm(f => ({ ...f, crime: e.target.value }))}>
                <option value="">-- Select Crime Type --</option>
                {Object.keys(CCFG).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 7 }}>
              <div className="fl">Area *</div>
              <select value={form.area} onChange={e => handleAreaChange(e.target.value)}>
                <option value="">-- Select Area --</option>
                {Object.keys(AREA_COORDS).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 7 }}>
              <div className="fl">Police Station</div>
              <select value={form.ps} onChange={e => setForm(f => ({ ...f, ps: e.target.value }))}>
                {['Central PS', 'Srirangam PS', 'Ariyamangalam PS', 'Woraiyur PS', 'Traffic PS'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="fg2" style={{ marginBottom: 7 }}>
              <div className="fg"><div className="fl">Date</div><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="fg"><div className="fl">Time</div><input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
            </div>
            <div className="fg2" style={{ marginBottom: 7 }}>
              <div className="fg"><div className="fl">Latitude</div><input type="text" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="10.7905" /></div>
              <div className="fg"><div className="fl">Longitude</div><input type="text" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="78.7047" /></div>
            </div>
            <div className="fg2" style={{ marginBottom: 7 }}>
              <div className="fg">
                <div className="fl">Victim</div>
                <select value={form.victim} onChange={e => setForm(f => ({ ...f, victim: e.target.value }))}>
                  <option value="">N/A</option>
                  {['Male', 'Female', 'Minor', 'Elderly', 'Multiple'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Severity 1–5</div>
                <select value={form.sev} onChange={e => setForm(f => ({ ...f, sev: e.target.value }))}>
                  <option value="1">1 — Minor</option>
                  <option value="2">2 — Low</option>
                  <option value="3">3 — Medium</option>
                  <option value="4">4 — High</option>
                  <option value="5">5 — Critical</option>
                </select>
              </div>
            </div>
            <div className="fg" style={{ marginBottom: 9 }}>
              <div className="fl">Accused</div>
              <input type="text" value={form.accused} onChange={e => setForm(f => ({ ...f, accused: e.target.value }))} placeholder="Known / Unknown / Gang" />
            </div>
            {form.crime && (
              <div style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 6, padding: '6px 10px', fontSize: 10, color: '#00c8ff', marginBottom: 8, textAlign: 'center' }}>
                {CCFG[form.crime]?.i} Preview marker shown on map — fill area to locate
              </div>
            )}
            <button className="btn-red" onClick={submitFIR}>⚡ REGISTER IN CCTNS — MAP UPDATES INSTANTLY</button>
          </>
        )}

        {rTab === 'rec' && (
          <div style={{ maxHeight: 300, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {[...firs].reverse().slice(0, 15).map(f => {
              const cfg = CCFG[f.crimeType] || { c: '#888' };
              return (
                <div key={f.id} className="frow" onClick={() => { if (window._rsMap) window._rsMap.flyTo([f.lat, f.lng], 16, { duration: 1.5 }); }}>
                  <div className="fid">{f.id}</div>
                  <div className="ftype" style={{ color: cfg.c }}>{cfg.i || ''} {f.crimeType}</div>
                  <div className="fmeta"><span>{f.area}</span><span>{f.date}</span></div>
                  <div className="fsev" style={{ background: cfg.c, boxShadow: `0 0 5px ${cfg.c}` }} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI ANALYST */}
      <div className="card p">
        <div className="ct"><span>🤖</span> AI Crime Analyst</div>
        <div className="ai-chat" ref={aiChatRef}>
          {aiMsgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>{m.role === 'bot' ? '🤖 ' : ''}{m.text}</div>
          ))}
          {aiThinking && <div className="ai-msg bot" style={{ color: '#c084fc' }}>🤖 Analyzing data...</div>}
        </div>
        <div className="ai-input-wrap">
          <input className="ai-input" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAI()} placeholder="Ask about crime patterns..." />
          <button className="ai-send" onClick={sendAI}>➤</button>
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['Most dangerous area?', 'Peak crime time?', 'Women safety?', 'Next week forecast'].map(q => (
            <button key={q} onClick={() => { setAiInput(q); setTimeout(sendAI, 100); }}
              style={{ background: 'rgba(192,132,252,.15)', border: '1px solid rgba(192,132,252,.3)', color: '#c084fc', borderRadius: 10, padding: '3px 7px', fontSize: 9, cursor: 'pointer' }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* WEATHER */}
      <div className="card y">
        <div className="ct"><span>🌡️</span> Weather–Crime Correlation</div>
        <div style={{ fontSize: 9, color: '#475569', fontFamily: 'Share Tech Mono,monospace', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span>Tiruchirapalli, TN</span>
          <span style={{ color: weather?.src === 'LIVE' ? '#00c8ff' : '#fbbf24' }}>{weather?.src || '...'} · {weather ? `${weather.wind}km/h` : '—'}</span>
        </div>
        <div className="wgrid">
          <div className="witem"><span className="wicon">{wIcon}</span><div className="wval">{weather?.temp ?? '...'}°C</div><div className="wlbl">TEMPERATURE</div></div>
          <div className="witem"><span className="wicon">💧</span><div className="wval">{weather?.hum ?? '...'}%</div><div className="wlbl">HUMIDITY</div></div>
        </div>
        {weather && <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center', marginBottom: 7 }}>Feels like {weather.feels}°C{weather.rain ? ' · 🌧️ Rain active' : ''}</div>}
        <div style={{ fontSize: 9, color: '#475569', fontFamily: 'Share Tech Mono,monospace', marginBottom: 6 }}>CRIME RISK CORRELATION</div>
        {weather && [
          { l: 'Heat → Aggression', pct: Math.min(95, Math.round(30 + Math.max(0, weather.temp - 22) * 2.5)), c: '#ff2244' },
          { l: 'Night → Theft', pct: new Date().getHours() >= 20 || new Date().getHours() <= 6 ? 82 : 35, c: '#DAA520' },
          { l: 'Rain → Accidents', pct: weather.rain ? 85 : 38, c: '#00CED1' },
          { l: 'Humidity → Unrest', pct: Math.min(90, Math.round(20 + weather.hum * .55)), c: '#9400D3' },
        ].map(c => (
          <div key={c.l} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>
              <span>{c.l}</span><span style={{ color: c.c, fontFamily: 'Share Tech Mono,monospace' }}>{c.pct}%</span>
            </div>
            <div className="corr-bar"><div className="corr-fill" style={{ width: c.pct + '%', background: c.c }} /></div>
          </div>
        ))}
        {weather && (
          <div style={{ marginTop: 6, padding: '7px 10px', background: weather.temp >= 34 ? 'rgba(255,34,68,.08)' : weather.rain ? 'rgba(0,200,255,.08)' : 'rgba(0,255,136,.06)', border: `1px solid ${weather.temp >= 34 ? 'rgba(255,34,68,.3)' : weather.rain ? 'rgba(0,200,255,.3)' : 'rgba(0,255,136,.25)'}`, borderRadius: 6, fontSize: 10, color: weather.temp >= 34 ? '#ff2244' : weather.rain ? '#00c8ff' : '#00ff88' }}>
            {weather.temp >= 34 ? `🔴 EXTREME HEAT ${weather.temp}°C — Violent crime risk elevated +40%. Increase evening patrol density.` : weather.rain ? `🌧️ RAIN CONDITIONS — Accident risk +45%. Reduce patrol speed, increase NH-67 visibility.` : `🟢 NORMAL CONDITIONS ${weather.temp}°C — Standard patrol protocol applies.`}
          </div>
        )}
      </div>

      {/* PREDICTIONS */}
      <div className="card p">
        <div className="ct"><span>🧠</span> Predictive Analysis</div>
        <div style={{ fontSize: 9, color: '#475569', fontFamily: 'Share Tech Mono,monospace', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>REAL-TIME RISK · AUTO-REFRESH 60s</span>
          <span style={{ color: pred.filter(p => p.pct >= 65).length >= 3 ? '#ff2244' : '#00ff88' }}>
            {pred.filter(p => p.pct >= 65).length >= 3 ? '⚠️ ELEVATED' : '🟢 NORMAL'}
          </span>
        </div>
        {pred.map(p => {
          const lvl = p.pct >= 80 ? 'CRITICAL' : p.pct >= 65 ? 'HIGH' : p.pct >= 45 ? 'MODERATE' : 'LOW';
          const lc = p.pct >= 80 ? '#ff2244' : p.pct >= 65 ? '#ff7c1f' : p.pct >= 45 ? '#fbbf24' : '#00ff88';
          return (
            <div key={p.l} className="prow">
              <div className="plbl">{p.l}</div>
              <div className="pbar"><div className="pfill" style={{ width: p.pct + '%', background: p.c }} /></div>
              <div className="ppct-wrap">
                <span className="ppct" style={{ color: p.c }}>{p.pct}%</span>
                <span className="plvl" style={{ color: lc }}>{lvl}</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 6, fontSize: 9, color: '#475569', borderTop: '1px solid #1e3a5f', paddingTop: 6 }}>⚙️ Factors: Time · Season · Weather · Day of week</div>
      </div>

      {/* RADAR */}
      <div className="card">
        <div className="ct"><span>📡</span> Live Threat Radar</div>
        <div className="radar-wrap">
          <svg className="radar-svg" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
            <circle cx="85" cy="85" r="78" fill="none" stroke="rgba(0,200,255,.1)" strokeWidth="1" />
            <circle cx="85" cy="85" r="58" fill="none" stroke="rgba(0,200,255,.1)" strokeWidth="1" />
            <circle cx="85" cy="85" r="38" fill="none" stroke="rgba(0,200,255,.15)" strokeWidth="1" />
            <circle cx="85" cy="85" r="18" fill="none" stroke="rgba(0,200,255,.2)" strokeWidth="1" />
            <line x1="7" y1="85" x2="163" y2="85" stroke="rgba(0,200,255,.07)" strokeWidth="1" />
            <line x1="85" y1="7" x2="85" y2="163" stroke="rgba(0,200,255,.07)" strokeWidth="1" />
            <g className="radar-sweep">
              <path d="M85,85 L85,7 A78,78 0 0,1 153,111 Z" fill="url(#sg)" opacity=".6" />
            </g>
            {[[65, 68, .5, '#ff2244'], [105, 62, 1.2, '#ff7c1f'], [72, 112, .8, '#ff2244'], [120, 97, 1.5, '#ff7c1f'], [52, 85, .3, '#ff2244'], [115, 127, .2, '#ff2244'], [88, 48, 2, '#fbbf24']].map(([cx, cy, d, c], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill={c} className="radar-blip" style={{ animationDelay: d + 's' }} />
            ))}
            <circle cx="85" cy="85" r="4" fill="#00c8ff" opacity=".8" />
            <circle cx="85" cy="85" r="8" fill="none" stroke="#00c8ff" strokeWidth="1" opacity=".4" />
            <text x="85" y="5" textAnchor="middle" fill="rgba(0,200,255,.5)" fontSize="8" fontFamily="Share Tech Mono">N</text>
            <text x="166" y="89" textAnchor="middle" fill="rgba(0,200,255,.5)" fontSize="8" fontFamily="Share Tech Mono">E</text>
            <text x="85" y="168" textAnchor="middle" fill="rgba(0,200,255,.5)" fontSize="8" fontFamily="Share Tech Mono">S</text>
            <text x="4" y="89" textAnchor="middle" fill="rgba(0,200,255,.5)" fontSize="8" fontFamily="Share Tech Mono">W</text>
            <defs>
              <radialGradient id="sg" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox" gradientTransform="translate(.5 .5) rotate(90)">
                <stop offset="0%" stopColor="rgba(0,200,255,.6)" />
                <stop offset="100%" stopColor="rgba(0,200,255,0)" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* PATROL UNITS */}
      <div className="card">
        <div className="ct"><span>🚔</span> Active Patrol Units</div>
        {PATROL_UNITS.map(u => (
          <div key={u.n} className="punit" style={{ opacity: u.a ? 1 : .5 }} onClick={() => setView('patrol')}>
            <div className="picon">{u.i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="pname-row">
                <span className="pname">{u.n}</span>
                <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 8, background: u.a ? 'rgba(0,255,136,.15)' : 'rgba(71,85,105,.3)', color: u.a ? '#00ff88' : '#475569', border: `1px solid ${u.a ? 'rgba(0,255,136,.3)' : 'rgba(71,85,105,.4)'}` }}>{u.a ? 'ACTIVE' : 'OFF DUTY'}</span>
              </div>
              <div className="ploc">{u.l} · {u.speed}</div>
              <div className="fuel-bar">
                <div style={{ height: '100%', width: u.fuel + '%', background: u.fuel < 50 ? '#ff2244' : u.fuel < 70 ? '#fbbf24' : '#00ff88', borderRadius: 2, transition: 'width .5s' }} />
              </div>
              <div style={{ fontSize: 8, color: '#475569', marginTop: 1 }}>Fuel: {u.fuel}%</div>
            </div>
            <div className={`pdot ${u.a ? '' : 'off'}`} />
          </div>
        ))}
        <button className="btn-blue" style={{ marginTop: 4 }} onClick={() => setView('patrol')}>VIEW PATROL ROUTES ON MAP</button>
      </div>

      {/* IPC REFERENCE */}
      <div className="card">
        <div className="ct"><span>⚖️</span> IPC Quick Reference</div>
        <input className="ipc-s" value={ipcSearch} onChange={e => setIpcSearch(e.target.value)} placeholder="Search section or name..." />
        <div className="ipc-l">
          {ipcFiltered.map(i => (
            <div key={i.s} className="irow">
              <span className="ino">{i.s}</span>
              <span className="idsc">{i.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint"><span>↓ SCROLL FOR MORE</span></div>
    </aside>
  );
}
