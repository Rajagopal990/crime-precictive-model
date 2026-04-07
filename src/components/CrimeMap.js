import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const colorByLevel = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

const zoneTypeByLevel = {
  high: 'Critical Zone',
  medium: 'Watch Zone',
  low: 'Low Risk Zone'
};

const LABEL_ZOOM_THRESHOLD = 12;
const TOOLTIP_ZOOM_THRESHOLD = 10;

const PATROL_COLORS = {
  north: '#ef4444',
  central: '#06b6d4',
  south: '#8b5cf6',
  coastal: '#f59e0b',
  all: '#22c55e'
};

const FALLBACK_PATROL_AREAS = {
  north: [
    { latitude: 13.1572, longitude: 80.3015 },
    { latitude: 13.1428, longitude: 80.2951 },
    { latitude: 13.1264, longitude: 80.2862 },
    { latitude: 13.1121, longitude: 80.2718 }
  ],
  central: [
    { latitude: 13.0827, longitude: 80.2707 },
    { latitude: 13.0678, longitude: 80.2561 },
    { latitude: 13.0544, longitude: 80.2455 },
    { latitude: 13.0419, longitude: 80.2368 }
  ],
  south: [
    { latitude: 13.0291, longitude: 80.2327 },
    { latitude: 13.0143, longitude: 80.2294 },
    { latitude: 12.9988, longitude: 80.2241 },
    { latitude: 12.9812, longitude: 80.2175 }
  ],
  coastal: [
    { latitude: 13.1524, longitude: 80.3202 },
    { latitude: 13.1172, longitude: 80.3154 },
    { latitude: 13.0788, longitude: 80.3079 },
    { latitude: 13.0341, longitude: 80.2978 }
  ]
};

const FALLBACK_PATROL_UNITS = {
  north: [
    { id: 'N-21', latitude: 13.1492, longitude: 80.2982, type: 'SUV' },
    { id: 'N-33', latitude: 13.1218, longitude: 80.2793, type: 'Bike' }
  ],
  central: [
    { id: 'C-11', latitude: 13.0731, longitude: 80.2629, type: 'SUV' },
    { id: 'C-17', latitude: 13.0497, longitude: 80.2411, type: 'Bike' }
  ],
  south: [
    { id: 'S-08', latitude: 13.0072, longitude: 80.2267, type: 'SUV' },
    { id: 'S-19', latitude: 12.9874, longitude: 80.2192, type: 'Bike' }
  ],
  coastal: [
    { id: 'E-41', latitude: 13.1321, longitude: 80.3187, type: 'Coastal Jeep' },
    { id: 'E-56', latitude: 13.0672, longitude: 80.3063, type: 'Bike' }
  ]
};

function ZoomWatcher({ onZoomChange }) {
  useMapEvents({
    zoomend(event) {
      onZoomChange(event.target.getZoom());
    }
  });
  return null;
}

function markerIcon(color, label, borderColor = '#0f172a') {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: ${color};
      color: #fff;
      border: 2px solid ${borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    ">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
  });
}

function coastlineLongitude(latitude) {
  const minLat = 12.85;
  const maxLat = 13.28;
  const clampedLat = Math.max(minLat, Math.min(maxLat, latitude));
  const t = (clampedLat - minLat) / (maxLat - minLat);
  return 80.255 + t * (80.33 - 80.255);
}

function normalizeToLand(point, index, offset = 0) {
  const latitude = Number(point?.latitude);
  const longitude = Number(point?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return point;
  }

  const inChennaiBand = latitude >= 12.75 && latitude <= 13.35;
  if (!inChennaiBand) {
    return point;
  }

  const coastLon = coastlineLongitude(latitude);
  const inSea = longitude > coastLon + 0.008;
  if (!inSea) {
    return point;
  }

  const stagger = ((index + offset) % 4) * 0.0026;
  const inlandLongitude = Number((coastLon - 0.007 - stagger).toFixed(5));
  return { ...point, longitude: inlandLongitude };
}

function parseCoordinate(value, fallback = null) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  return fallback;
}

function normalizeCoordinatePoint(point, index, offset = 0) {
  if (!point || typeof point !== 'object') return null;

  const latitude = parseCoordinate(point.latitude, parseCoordinate(point.lat, parseCoordinate(point.y)));
  const longitude = parseCoordinate(
    point.longitude,
    parseCoordinate(point.lng, parseCoordinate(point.lon, parseCoordinate(point.long, parseCoordinate(point.x))))
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return normalizeToLand({ ...point, latitude, longitude }, index, offset);
}

function toReadableDate(value) {
  if (!value) return 'N/A';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

function incidentLevel(incident) {
  const severity = Number(incident?.severity || 1);
  if (severity >= 4) return 'high';
  if (severity >= 3) return 'medium';
  return 'low';
}

function incidentLocationLabel(incident) {
  if (incident?.address) return incident.address;
  if (incident?.location) return incident.location;
  if (Number.isFinite(incident?.latitude) && Number.isFinite(incident?.longitude)) {
    return `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}`;
  }
  return 'Location unavailable';
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRad((b.latitude || 0) - (a.latitude || 0));
  const dLon = toRad((b.longitude || 0) - (a.longitude || 0));
  const lat1 = toRad(a.latitude || 0);
  const lat2 = toRad(b.latitude || 0);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function buildShortestRoute(points) {
  if (!points || points.length < 2) {
    return { route: points || [], segments: [], totalKm: 0 };
  }

  const remaining = [...points.slice(1)];
  const route = [points[0]];
  const segments = [];
  let totalKm = 0;

  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nearestIdx = 0;
    let nearestDistance = Number.MAX_VALUE;

    for (let i = 0; i < remaining.length; i += 1) {
      const km = distanceKm(current, remaining[i]);
      if (km < nearestDistance) {
        nearestDistance = km;
        nearestIdx = i;
      }
    }

    const next = remaining.splice(nearestIdx, 1)[0];
    route.push(next);
    segments.push(Number(nearestDistance.toFixed(2)));
    totalKm += nearestDistance;
  }

  return { route, segments, totalKm: Number(totalKm.toFixed(2)) };
}

function uniquePoints(points) {
  const seen = new Set();
  return points.filter((p) => {
    const key = `${p.latitude?.toFixed?.(5) ?? p.latitude}-${p.longitude?.toFixed?.(5) ?? p.longitude}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickRoutePoints(zones, sortKey, asc = false, take = 6) {
  const sorted = [...zones]
    .filter((z) => Number.isFinite(z.latitude) && Number.isFinite(z.longitude))
    .sort((a, b) => (asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]));

  const selected = sorted.slice(0, take).map((z) => ({ latitude: z.latitude, longitude: z.longitude }));
  return uniquePoints(selected);
}

function buildPatrolAreas(baseRoute, zones) {
  const basePoints = uniquePoints(baseRoute.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)));

  const northRaw = pickRoutePoints(zones, 'latitude', false, 6);
  const southRaw = pickRoutePoints(zones, 'latitude', true, 6);
  const coastalRaw = pickRoutePoints(zones, 'longitude', false, 6);

  const mid = [...zones]
    .filter((z) => Number.isFinite(z.latitude) && Number.isFinite(z.longitude))
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 8)
    .map((z) => ({ latitude: z.latitude, longitude: z.longitude }));

  const centralRaw = uniquePoints(mid.length >= 2 ? mid : basePoints.slice(0, 6));

  const fallbackNorth = FALLBACK_PATROL_AREAS.north;
  const fallbackCentral = FALLBACK_PATROL_AREAS.central;
  const fallbackSouth = FALLBACK_PATROL_AREAS.south;
  const fallbackCoastal = FALLBACK_PATROL_AREAS.coastal;

  const areas = {
    north: buildShortestRoute(
      northRaw.length >= 2 ? northRaw : (basePoints.slice(0, 4).length >= 2 ? basePoints.slice(0, 4) : fallbackNorth)
    ),
    central: buildShortestRoute(
      centralRaw.length >= 2 ? centralRaw : (basePoints.slice(0, 4).length >= 2 ? basePoints.slice(0, 4) : fallbackCentral)
    ),
    south: buildShortestRoute(
      southRaw.length >= 2 ? southRaw : (basePoints.slice(-4).length >= 2 ? basePoints.slice(-4) : fallbackSouth)
    ),
    coastal: buildShortestRoute(
      coastalRaw.length >= 2 ? coastalRaw : (basePoints.slice(0, 4).length >= 2 ? basePoints.slice(0, 4) : fallbackCoastal)
    )
  };

  const allPoints = uniquePoints([
    ...areas.north.route,
    ...areas.central.route,
    ...areas.south.route,
    ...areas.coastal.route
  ]);

  areas.all = buildShortestRoute(allPoints.length >= 2 ? allPoints : basePoints);
  return areas;
}

export default function CrimeMap({ hotspots, womenSafety, accidents, patrolRoute, riskZones, incidents }) {
  const [mapMode, setMapMode] = useState('heatmap');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(11);
  const [patrolArea, setPatrolArea] = useState('central');

  const normalizedWomenSafety = (womenSafety || [])
    .slice(0, 40)
    .map((item, idx) => normalizeCoordinatePoint(item, idx, 120))
    .filter(Boolean);
  const normalizedRouteRaw = (patrolRoute?.route || [])
    .map((item, idx) => normalizeCoordinatePoint(item, idx, 360))
    .filter(Boolean);
  const normalizedZones = (riskZones || [])
    .slice(0, 60)
    .map((item, idx) => normalizeCoordinatePoint(item, idx, 480))
    .filter(Boolean);
  const normalizedIncidents = (incidents || [])
    .slice(0, 600)
    .map((item, idx) => normalizeCoordinatePoint(item, idx, 620))
    .filter(Boolean);

  const filteredIncidents = useMemo(
    () =>
      normalizedIncidents.filter((incident) => {
        if (riskLevelFilter === 'all') return true;
        return incidentLevel(incident) === riskLevelFilter;
      }),
    [normalizedIncidents, riskLevelFilter]
  );

  const filteredZones = useMemo(
    () =>
      normalizedZones.filter((zone) => {
        if (riskLevelFilter === 'all') return true;
        return String(zone.level || '').toLowerCase() === riskLevelFilter;
      }),
    [normalizedZones, riskLevelFilter]
  );

  const patrolAreas = useMemo(() => buildPatrolAreas(normalizedRouteRaw, normalizedZones), [normalizedRouteRaw, normalizedZones]);
  const activePatrol = patrolAreas[patrolArea] || patrolAreas.central;

  const activeUnits = patrolArea === 'all'
    ? [...FALLBACK_PATROL_UNITS.north, ...FALLBACK_PATROL_UNITS.central, ...FALLBACK_PATROL_UNITS.south, ...FALLBACK_PATROL_UNITS.coastal]
    : (FALLBACK_PATROL_UNITS[patrolArea] || []);

  const center = mapMode === 'patrol' && activePatrol?.route?.[0]
    ? [activePatrol.route[0].latitude, activePatrol.route[0].longitude]
    : filteredIncidents?.[0]
      ? [filteredIncidents[0].latitude, filteredIncidents[0].longitude]
      : filteredZones?.[0]
        ? [filteredZones[0].latitude, filteredZones[0].longitude]
        : [13.0827, 80.2707];

  const hasSignals = Boolean(filteredIncidents.length || filteredZones.length || normalizedWomenSafety.length || activePatrol?.route?.length);

  const allowAnyText = zoomLevel >= TOOLTIP_ZOOM_THRESHOLD;
  const allowPermanentLabels = showLabels && zoomLevel >= LABEL_ZOOM_THRESHOLD && mapMode !== 'heatmap';

  const modeButtonClass = (id, danger = false) =>
    `rounded-xl border px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
      mapMode === id
        ? danger
          ? 'border-red-500 bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]'
          : 'border-blue-500 bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
        : danger
          ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
          : 'border-cyan-500/40 bg-[#0b1b36] text-cyan-100 hover:bg-[#11305f]'
    }`;

  return (
    <div className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#081328] shadow-[0_0_24px_rgba(0,200,255,0.15)]">
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-800">Map Partition Controls</h3>
            <p className="mt-1 text-xs text-slate-500">
              Patrol is now independent from zones. Select patrol area to view routes in different regions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={modeButtonClass('heatmap')} onClick={() => setMapMode('heatmap')}>HEATMAP</button>
            <button type="button" className={modeButtonClass('markers')} onClick={() => setMapMode('markers')}>MARKERS</button>
            <button type="button" className={modeButtonClass('zones')} onClick={() => setMapMode('zones')}>ZONES</button>
            <button type="button" className={modeButtonClass('patrol', true)} onClick={() => setMapMode('patrol')}>PATROL</button>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-cyan-500/20 bg-[#0b1b36] p-3 text-xs text-cyan-100 md:grid-cols-4">
          <label className="flex items-center gap-2">
            <span className="w-20 font-medium">Risk</span>
            <select
              className="flex-1 rounded-lg border border-cyan-500/30 bg-[#0e2548] px-2 py-1 text-cyan-100"
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
            Always Show Labels
          </label>

          {mapMode === 'patrol' && (
            <label className="flex items-center gap-2">
              <span className="w-20 font-medium">Patrol Area</span>
              <select
                className="flex-1 rounded-lg border border-cyan-500/30 bg-[#0e2548] px-2 py-1 text-cyan-100"
                value={patrolArea}
                onChange={(e) => setPatrolArea(e.target.value)}
              >
                <option value="north">North Patrol</option>
                <option value="central">Central Patrol</option>
                <option value="south">South Patrol</option>
                <option value="coastal">Coastal Patrol</option>
                <option value="all">All Areas Patrol</option>
              </select>
            </label>
          )}

          <div className="text-xs text-slate-500">
            {mapMode === 'patrol'
              ? `${patrolArea.toUpperCase()} route distance: ${activePatrol?.totalKm || 0} km`
              : `Current Zoom: ${zoomLevel.toFixed(1)}`}
          </div>
        </div>
      </div>

      {!hasSignals && <div className="px-4 pb-4 text-sm text-slate-500">No map data for selected filters.</div>}

      <MapContainer center={center} zoom={11} style={{ height: '520px', width: '100%' }} className="z-0">
        <ZoomWatcher onZoomChange={setZoomLevel} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="REDSHIELD-style partition view | data from your FIR records"
        />

        {mapMode === 'heatmap' &&
          filteredIncidents.map((incident, idx) => {
            const level = incidentLevel(incident);
            const color = colorByLevel[level];
            const severity = Number(incident.severity || 1);
            return (
              <CircleMarker
                key={`heat-${incident.id || idx}`}
                center={[incident.latitude, incident.longitude]}
                radius={Math.min(16, 4 + severity * 2)}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.28, weight: 1 }}
              >
                {allowAnyText && <Tooltip permanent={false}>{incident.crime_type} | {level.toUpperCase()}</Tooltip>}
                <Popup>
                  <div className="text-sm min-w-[230px]">
                    <p className="font-semibold">Past Crime Incident</p>
                    <p>Crime Type: {incident.crime_type}</p>
                    <p>Level: {level.toUpperCase()}</p>
                    <p>Severity: {incident.severity ?? 'N/A'}</p>
                    <p>Occurred: {toReadableDate(incident.occurred_at)}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {mapMode === 'markers' &&
          filteredIncidents.map((incident, idx) => {
            const level = incidentLevel(incident);
            const label = level === 'high' ? 'H' : level === 'medium' ? 'M' : 'L';
            const locationLabel = incidentLocationLabel(incident);
            return (
              <Marker
                key={`incident-${incident.id || idx}`}
                position={[incident.latitude, incident.longitude]}
                icon={markerIcon(colorByLevel[level], label)}
              >
                {allowAnyText && <Tooltip permanent={allowPermanentLabels}>{locationLabel}</Tooltip>}
                <Popup>
                  <div className="text-sm min-w-[230px]">
                    <p className="font-semibold">Crime Incident Location</p>
                    <p>Location: {locationLabel}</p>
                    <p>Crime Type: {incident.crime_type}</p>
                    <p>Level: {level.toUpperCase()}</p>
                    <p>Severity: {incident.severity ?? 'N/A'}</p>
                    <p>Station: {incident.police_station || 'N/A'}</p>
                    <p>Occurred: {toReadableDate(incident.occurred_at)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {mapMode === 'zones' &&
          filteredZones.map((zone, idx) => {
            const level = zone.level || 'low';
            const color = colorByLevel[level] || '#2563eb';
            const zoneRadius = Math.max(200, (Number(zone.incident_count) || 1) * 45);
            return (
              <Circle
                key={`zone-${idx}`}
                center={[zone.latitude, zone.longitude]}
                radius={zoneRadius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.1, dashArray: '6 6', weight: 2 }}
              >
                {allowAnyText && <Tooltip permanent={allowPermanentLabels}>{zone.area} | {zoneTypeByLevel[level]}</Tooltip>}
                <Popup>
                  <div className="min-w-[230px] text-sm">
                    <p className="font-semibold">{zone.area}</p>
                    <p>Zone Type: {zoneTypeByLevel[level]}</p>
                    <p>Risk Level: {String(level).toUpperCase()}</p>
                    <p>Risk Score: {zone.risk_score ?? 'N/A'}</p>
                    <p>Incident Count: {zone.incident_count ?? 'N/A'}</p>
                    <p>Last Incident: {toReadableDate(zone.last_incident_at)}</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {mapMode === 'patrol' && activePatrol?.route?.length > 1 && (
          <Polyline
            positions={activePatrol.route.map((point) => [point.latitude, point.longitude])}
            pathOptions={{ color: PATROL_COLORS[patrolArea] || '#8b5cf6', weight: 5, opacity: 0.85, dashArray: '10 6' }}
          />
        )}

        {mapMode === 'patrol' &&
          activePatrol?.route?.map((point, idx) => {
            const nextKm = activePatrol.segments[idx] ?? null;
            return (
              <Marker
                key={`patrol-${patrolArea}-${idx}`}
                position={[point.latitude, point.longitude]}
                icon={markerIcon(PATROL_COLORS[patrolArea] || '#8b5cf6', String(idx + 1), '#1e1b4b')}
              >
                {allowAnyText && (
                  <Tooltip permanent={allowPermanentLabels}>
                    {patrolArea.toUpperCase()} Patrol {idx + 1}{nextKm !== null ? ` -> ${nextKm} km` : ''}
                  </Tooltip>
                )}
                <Popup>
                  <div className="text-sm min-w-[230px]">
                    <p className="font-semibold">{patrolArea.toUpperCase()} Patrol Checkpoint {idx + 1}</p>
                    <p>Latitude: {point.latitude}</p>
                    <p>Longitude: {point.longitude}</p>
                    {nextKm !== null ? <p>Distance to next point: {nextKm} km</p> : <p>Last checkpoint</p>}
                    <p>Total {patrolArea} route distance: {activePatrol.totalKm} km</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {mapMode === 'patrol' &&
          activeUnits.map((unit, idx) => (
            <Marker
              key={`unit-${unit.id}-${idx}`}
              position={[unit.latitude, unit.longitude]}
              icon={markerIcon('#f97316', `U${idx + 1}`, '#7c2d12')}
            >
              {allowAnyText && <Tooltip permanent={allowPermanentLabels}>Unit {unit.id}</Tooltip>}
              <Popup>
                <div className="text-sm min-w-[220px]">
                  <p className="font-semibold">Patrol Unit {unit.id}</p>
                  <p>Deployment Area: {patrolArea.toUpperCase()}</p>
                  <p>Vehicle Type: {unit.type}</p>
                  <p>Status: Active Patrol</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}



