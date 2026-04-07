import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

function toSeries(obj = {}, xName) {
  return Object.entries(obj)
    .map(([key, value]) => ({ [xName]: key, value }))
    .sort((a, b) => Number(a[xName]) - Number(b[xName]));
}

function ChartPanel({ title, description, hasData, children }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-3 h-64">
        {hasData ? children : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No trend data available yet.</div>}
      </div>
    </div>
  );
}

export default function TrendCharts({ behavior }) {
  const hourData = toSeries(behavior?.by_hour, 'hour');
  const monthData = toSeries(behavior?.by_month, 'month');

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartPanel title="Crime vs Time of Day" description="Hourly crime pattern across the current filtered result set." hasData={hourData.length > 0}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.35} />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>

      <ChartPanel title="Crime vs Month" description="Month-wise incident volume to highlight seasonality." hasData={monthData.length > 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.35} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#f59e0b" name="Incidents" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}
