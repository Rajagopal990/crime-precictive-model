import { useMemo, useState } from 'react';

import { CRIME_TYPE_OPTIONS, DEFAULT_TAMIL_NADU_AREA, TAMIL_NADU_AREAS } from '../constants/firOptions';

const DEFAULT = {
  crime_code: '379',
  crime_type: 'IPC-Theft',
  occurred_at: new Date().toISOString().slice(0, 16),
  latitude: DEFAULT_TAMIL_NADU_AREA.latitude,
  longitude: DEFAULT_TAMIL_NADU_AREA.longitude,
  address: DEFAULT_TAMIL_NADU_AREA.address,
  description: 'Snatching reported near market.',
  police_station: DEFAULT_TAMIL_NADU_AREA.policeStation,
  is_accident: false,
  is_women_related: false,
  severity: 2
};

const FIELD_LABELS = [
  ['crime_code', 'Crime Code'],
  ['latitude', 'Latitude'],
  ['longitude', 'Longitude'],
  ['address', 'Address']
];

export default function FIRForm({ onSubmit, predictResult }) {
  const [form, setForm] = useState(DEFAULT);

  const selectedArea = useMemo(
    () => TAMIL_NADU_AREAS.find((area) => area.policeStation === form.police_station) || DEFAULT_TAMIL_NADU_AREA,
    [form.police_station]
  );

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="font-display text-lg font-semibold">Manual FIR Entry</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Capture a new incident, choose a Tamil Nadu area, and refresh hotspot analytics instantly.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Crime Type</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            value={form.crime_type}
            onChange={(e) => {
              const nextCrimeType = e.target.value;
              const option = CRIME_TYPE_OPTIONS.find((item) => item.value === nextCrimeType);
              setForm((v) => ({
                ...v,
                crime_type: nextCrimeType,
                crime_code: option?.code || v.crime_code
              }));
            }}
          >
            {CRIME_TYPE_OPTIONS.filter((item) => item.value).map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tamil Nadu Area</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            value={form.police_station}
            onChange={(e) => {
              const area = TAMIL_NADU_AREAS.find((item) => item.policeStation === e.target.value) || DEFAULT_TAMIL_NADU_AREA;
              setForm((v) => ({
                ...v,
                police_station: area.policeStation,
                address: area.address,
                latitude: area.latitude,
                longitude: area.longitude
              }));
            }}
          >
            {TAMIL_NADU_AREAS.map((area) => (
              <option key={area.policeStation} value={area.policeStation}>
                {area.label}
              </option>
            ))}
          </select>
        </label>

        {FIELD_LABELS.map(([field, label]) => (
          <label key={field} className="space-y-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
              placeholder={label}
              value={form[field]}
              onChange={(e) =>
                setForm((v) => ({
                  ...v,
                  [field]: field === 'latitude' || field === 'longitude' ? Number(e.target.value) : e.target.value
                }))
              }
            />
          </label>
        ))}

        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Police Station</span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            value={form.police_station}
            onChange={(e) => setForm((v) => ({ ...v, police_station: e.target.value }))}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Occurred At</span>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            value={form.occurred_at}
            onChange={(e) => setForm((v) => ({ ...v, occurred_at: e.target.value }))}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Severity</span>
          <input
            type="number"
            min={1}
            max={5}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            value={form.severity}
            onChange={(e) => setForm((v) => ({ ...v, severity: Number(e.target.value) }))}
          />
        </label>
      </div>

      <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs text-cyan-900 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-100">
        Suggested hotspot seed: {selectedArea.label} | {selectedArea.address}
      </div>

      <label className="mt-3 block space-y-1 text-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</span>
        <textarea
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
          rows={4}
          value={form.description}
          onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <label className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
          <input
            type="checkbox"
            checked={form.is_accident}
            onChange={(e) => setForm((v) => ({ ...v, is_accident: e.target.checked }))}
          />
          Accident-linked
        </label>
        <label className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
          <input
            type="checkbox"
            checked={form.is_women_related}
            onChange={(e) => setForm((v) => ({ ...v, is_women_related: e.target.checked }))}
          />
          Women safety case
        </label>
      </div>
      <button
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
        onClick={() => onSubmit({ ...form, occurred_at: new Date(form.occurred_at).toISOString() })}
      >
        Save FIR & Refresh Analytics
      </button>
      {predictResult && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          Predicted Risk: <span className="font-semibold">{predictResult.label.toUpperCase()}</span> ({(predictResult.probability * 100).toFixed(1)}%)
        </div>
      )}
    </div>
  );
}
