import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PS_LIST, PATROL_ROUTES, CCFG } from '../data/mockData';

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function mkPopup(f) {
  const cfg = CCFG[f.crimeType] || { c: '#888', i: '⚠️' };
  const sc = f.severity >= 4 ? '#ff2244' : f.severity >= 3 ? '#ff7c1f' : '#fbbf24';
  return `<div style="font-family:Inter,sans-serif;min-width:200px">
    <div style="font-family:Orbitron,monospace;font-size:13px;color:${cfg.c};margin-bottom:8px">${cfg.i} ${f.crimeType}</div>
    <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">📋 ${f.id}</div>
    <div style="font-size:11px;margin-bottom:2px">📍 ${f.area} · ${f.ps}</div>
    <div style="font-size:11px;margin-bottom:2px">📅 ${f.date} ${f.time}</div>
    <div style="font-size:11px;margin-bottom:2px">⚖️ ${f.act} §${f.ipc}</div>
    ${f.victim ? `<div style="font-size:11px;margin-bottom:2px">👤 Victim: ${f.victim}</div>` : ''}
    <div style="font-size:11px;margin-bottom:8px">🔍 Accused: ${f.accused}</div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10px;padding:3px 8px;border-radius:10px;background:${f.status==='Arrested'?'rgba(0,255,136,.15)':f.status==='Chargesheeted'?'rgba(251,191,36,.15)':'rgba(255,34,68,.15)'};color:${f.status==='Arrested'?'#00ff88':f.status==='Chargesheeted'?'#fbbf24':'#ff2244'};border:1px solid ${f.status==='Arrested'?'rgba(0,255,136,.3)':f.status==='Chargesheeted'?'rgba(251,191,36,.3)':'rgba(255,34,68,.3)'}">${f.status}</span>
      <span style="font-family:Orbitron,monospace;font-size:11px;color:${sc}">SEV: ${f.severity}/5</span>
    </div>
  </div>`;
}

function addDotToMap(f, map, layersRef) {
  const cfg = CCFG[f.crimeType] || { c: '#888', i: '⚠️' };
  const sz = 10 + f.severity * 3;
  const ic = L.divIcon({
    html: `<div style="background:${cfg.c};width:${sz}px;height:${sz}px;border-radius:50%;border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:${6 + f.severity}px;box-shadow:0 0 ${f.severity * 4}px ${cfg.c};animation:pulse-m 2s ease-in-out infinite">${f.severity >= 4 ? cfg.i : ''}</div>`,
    className: '', iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2]
  });
  const m = L.marker([f.lat, f.lng], { icon: ic }).bindPopup(mkPopup(f)).addTo(map);
  layersRef.current.push(m);
}

export default function MapView({ firs, view, setView, onExport, mapRef: externalMapRef }) {
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef([]);
  const heatRef = useRef(null);
  const previewRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapInstance.current || !mapContainerRef.current) return;
    mapInstance.current = L.map(mapContainerRef.current, { center: [10.7905, 78.7047], zoom: 13 });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '⚠️ REDSHIELD v3.0 | Tiruchirapalli | CCTNS', maxZoom: 19
    }).addTo(mapInstance.current);
    PS_LIST.forEach(ps => {
      const ic = L.divIcon({
        html: `<div style="background:#0a1628;border:1px solid #00c8ff;border-radius:5px;padding:3px 7px;font-size:9px;color:#00c8ff;font-family:Orbitron,sans-serif;font-weight:700;white-space:nowrap">🚔 ${ps.name}</div>`,
        className: '', iconAnchor: [40, 14]
      });
      L.marker([ps.lat, ps.lng], { icon: ic }).addTo(mapInstance.current);
    });
    return () => {};
  }, []);

  // Expose map instance globally for FIR form preview & add-marker
  useEffect(() => {
    if (!mapInstance.current) return;
    window._rsMap = mapInstance.current;
    window._rsPreview = (lat, lng, crimeType, severity, area) => {
      if (!mapInstance.current) return;
      if (previewRef.current) { mapInstance.current.removeLayer(previewRef.current); previewRef.current = null; }
      if (!crimeType) return;
      const cfg = CCFG[crimeType] || { c: '#888', i: '❓' };
      const sz = 16 + severity * 3;
      const ic = L.divIcon({
        html: `<div style="position:relative;width:${sz + 20}px;height:${sz + 20}px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:${sz + 16}px;height:${sz + 16}px;border-radius:50%;border:2px solid ${cfg.c};animation:pulse-m 1s ease-in-out infinite;opacity:.5"></div><div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${cfg.c};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:${sz * .55}px;box-shadow:0 0 ${severity * 6}px ${cfg.c};z-index:2">${cfg.i}</div></div>`,
        className: '', iconSize: [sz + 20, sz + 20], iconAnchor: [(sz + 20) / 2, (sz + 20) / 2]
      });
      previewRef.current = L.marker([lat, lng], { icon: ic, zIndexOffset: 1000 })
        .bindPopup(`<div style="font-family:Inter,sans-serif"><b style="color:${cfg.c}">${cfg.i} ${crimeType}</b><br><small style="color:#fbbf24">⚠️ PREVIEW — Not registered yet</small><br><small>Area: ${area || '—'}</small></div>`)
        .addTo(mapInstance.current);
      mapInstance.current.flyTo([lat, lng], 15, { duration: .8 });
    };
    window._rsAddMarker = (fir) => {
      if (!mapInstance.current) return;
      if (previewRef.current) { mapInstance.current.removeLayer(previewRef.current); previewRef.current = null; }
      addDotToMap(fir, mapInstance.current, layersRef);
    };
  });

  const clearLayers = () => {
    if (!mapInstance.current) return;
    if (heatRef.current) { mapInstance.current.removeLayer(heatRef.current); heatRef.current = null; }
    layersRef.current.forEach(l => mapInstance.current.removeLayer(l));
    layersRef.current = [];
  };

  const renderHeat = () => {
    const pts = firs.map(f => [f.lat, f.lng, f.severity * .2]);
    if (window.L && window.L.heatLayer) {
      try {
        heatRef.current = window.L.heatLayer(pts, {
          radius: 35, blur: 25, maxZoom: 17,
          gradient: { '.2': '#0000ff', '.4': '#00ff00', '.6': '#ffff00', '.8': '#ff6600', '1': '#ff0000' }
        }).addTo(mapInstance.current);
      } catch (e) {}
    }
    firs.forEach(f => addDotToMap(f, mapInstance.current, layersRef));
  };

  const renderMarkers = () => {
    firs.forEach(f => {
      const cfg = CCFG[f.crimeType] || { c: '#888', i: '⚠️' };
      const ic = L.divIcon({
        html: `<div style="background:${cfg.c};padding:4px 8px;border-radius:5px;color:white;font-size:10px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);font-family:monospace">${cfg.i} ${f.crimeType}</div>`,
        className: '', iconAnchor: [40, 16]
      });
      const m = L.marker([f.lat, f.lng], { icon: ic }).bindPopup(mkPopup(f)).addTo(mapInstance.current);
      layersRef.current.push(m);
    });
  };

  const renderZones = () => {
    const ar = {};
    firs.forEach(f => {
      if (!ar[f.area]) ar[f.area] = { c: 0, lat: f.lat, lng: f.lng, types: new Set(), s: 0 };
      ar[f.area].c++; ar[f.area].types.add(f.crimeType); ar[f.area].s += f.severity;
    });
    Object.entries(ar).forEach(([area, d]) => {
      const avg = d.s / d.c;
      const col = avg >= 4.5 ? '#ff0000' : avg >= 3.5 ? '#ff6600' : avg >= 2.5 ? '#ffaa00' : avg >= 1.5 ? '#ffff00' : '#00ff88';
      const circ = L.circle([d.lat, d.lng], { radius: 180 + d.c * 75, color: col, fillColor: col, fillOpacity: .22, weight: 2 })
        .bindPopup(`<div style="font-family:Orbitron,monospace;min-width:180px;color:#f0f8ff"><b style="color:${col}">${area}</b><br><small>${d.c} FIRs · Avg Sev ${avg.toFixed(1)}/5 · ${d.types.size} types</small><br><div style="margin-top:5px;font-size:10px;text-align:center;padding:3px;border-radius:4px;background:${col}22;color:${col};border:1px solid ${col}44">${avg >= 4.5 ? '🔴 CRITICAL' : avg >= 3.5 ? '🟠 HIGH RISK' : avg >= 2.5 ? '🟡 MODERATE' : '🟢 LOW RISK'}</div></div>`)
        .addTo(mapInstance.current);
      const lbl = L.divIcon({
        html: `<div style="background:${col}22;border:1px solid ${col};border-radius:4px;padding:2px 7px;font-size:9px;color:${col};font-family:Orbitron,sans-serif;font-weight:700;white-space:nowrap">${area}<br><span style="font-size:8px;opacity:.8">${d.c} FIRs</span></div>`,
        className: '', iconAnchor: [35, 14]
      });
      const lm = L.marker([d.lat, d.lng], { icon: lbl }).addTo(mapInstance.current);
      layersRef.current.push(circ);
      layersRef.current.push(lm);
    });
  };

  const renderPatrol = () => {
    [
      { pts: PATROL_ROUTES.night, c: '#ff2244', n: '🌙 Night Patrol' },
      { pts: PATROL_ROUTES.day, c: '#00c8ff', n: '☀️ Day Patrol' },
      { pts: PATROL_ROUTES.women, c: '#f472b6', n: '👩 Women Safety' }
    ].forEach(r => {
      const pl = L.polyline(r.pts, { color: r.c, weight: 3, opacity: .85, dashArray: '10,5' })
        .bindPopup(`<div style="font-family:Orbitron,monospace;font-size:13px;color:${r.c}">${r.n}</div>`)
        .addTo(mapInstance.current);
      const ic = L.divIcon({
        html: `<div style="background:${r.c};border-radius:50%;width:14px;height:14px;border:2px solid white;box-shadow:0 0 8px ${r.c}"></div>`,
        className: '', iconSize: [14, 14], iconAnchor: [7, 7]
      });
      const pm = L.marker(r.pts[0], { icon: ic }).addTo(mapInstance.current);
      layersRef.current.push(pl);
      layersRef.current.push(pm);
    });
    firs.filter(f => f.crimeType === 'Road Accident').forEach(a => {
      const ic = L.divIcon({
        html: `<div style="background:#ff6b00;border-radius:3px;padding:2px 6px;font-size:9px;color:white;font-weight:bold">⚠️ ACCIDENT ZONE</div>`,
        className: '', iconAnchor: [44, 11]
      });
      const m = L.marker([a.lat, a.lng], { icon: ic }).bindPopup(mkPopup(a)).addTo(mapInstance.current);
      layersRef.current.push(m);
    });
  };

  useEffect(() => {
    if (!mapInstance.current) return;
    clearLayers();
    if (view === 'heatmap') renderHeat();
    else if (view === 'markers') renderMarkers();
    else if (view === 'zones') renderZones();
    else if (view === 'patrol') renderPatrol();
  }, [firs, view]);

  return (
    <div className="map-wrap">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div className="map-btns">
        {[['heatmap', '🔥 HEATMAP'], ['markers', '📍 MARKERS'], ['zones', '🗺️ ZONES'], ['patrol', '🚔 PATROL']].map(([v, l]) => (
          <button key={v} className={`mb ${view === v ? 'active' : ''} ${v === 'patrol' ? 'danger' : ''}`} onClick={() => setView(v)}>{l}</button>
        ))}
        <button className="mb" onClick={onExport}>📥 EXPORT</button>
      </div>
    </div>
  );
}
