import { useState } from 'react';

const QUICK_QUERIES = [
  'Where are the highest crime hotspots?',
  'Which police stations have the highest FIR volume this month?',
  'Show women safety risk areas for evening patrol.',
  'Which zones have increasing accident-related incidents?',
  'Suggest patrol focus areas for the next 6 hours.',
  'What are the top crime patterns by time of day?',
  'Which station has the sharpest rise in severe crimes?',
  'Where should we deploy extra teams tonight?'
];

export default function ChatAssistant({ onAsk }) {
  const [query, setQuery] = useState(QUICK_QUERIES[0]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (nextQuery = query) => {
    const trimmed = (nextQuery || '').trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const response = await onAsk(trimmed);
      setQuery(trimmed);
      setAnswer(response || 'No response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-200 bg-cyan-50/90 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-900/20">
      <h3 className="font-display text-lg font-semibold">Police Query Assistant</h3>
      <p className="mt-1 text-xs text-cyan-800/70 dark:text-cyan-200/70">Ask a quick operational question about hotspots, patterns, or patrol planning.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_QUERIES.map((item) => (
          <button
            key={item}
            className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-[11px] font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-700 dark:bg-slate-900 dark:text-cyan-200 dark:hover:bg-cyan-900/30"
            onClick={() => handleAsk(item)}
            disabled={loading}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="min-w-0 flex-1 rounded-xl border border-cyan-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-cyan-700 dark:bg-slate-900"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <button
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => handleAsk()}
          disabled={loading}
          type="button"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200/70 bg-white/80 p-3 text-sm dark:border-cyan-900/60 dark:bg-slate-900/70">
        {answer || 'Assistant response will appear here.'}
      </div>
    </div>
  );
}
