import { Check } from 'lucide-react';

export default function TokenViewer({ tokenDetails = [] }) {
  if (!tokenDetails || tokenDetails.length === 0) {
    return <p className="text-xs text-slate-400 italic">No token details available.</p>;
  }

  const getPosBadgeColor = (pos) => {
    switch (pos) {
      case 'NOUN':
      case 'PROPN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'VERB':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ADJ':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'ADV':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="p-2.5">#</th>
            <th className="p-2.5">Token</th>
            <th className="p-2.5">Lemma (Base Form)</th>
            <th className="p-2.5">POS Tag</th>
            <th className="p-2.5">Stopword Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
          {tokenDetails.map((tok, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-2.5 text-slate-400">{idx + 1}</td>
              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                "{tok.text}"
              </td>
              <td className="p-2.5 text-cyan-600 dark:text-cyan-400">
                {tok.lemma}
              </td>
              <td className="p-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold border ${getPosBadgeColor(tok.pos)}`}>
                  {tok.pos}
                </span>
              </td>
              <td className="p-2.5 font-sans">
                {tok.is_stop ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <Check className="w-3 h-3 text-slate-400" /> Filtered Stopword
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" /> Content Token
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
