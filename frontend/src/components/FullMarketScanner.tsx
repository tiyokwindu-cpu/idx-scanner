'use client';
import { useState } from 'react';

export default function FullMarketScanner() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [minScore, setMinScore] = useState(70);
  const [meta, setMeta] = useState({ total_universe: 0, matched_count: 0 });

  const runFullScan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/scanner/full-market?min_score=${minScore}`);
      const json = await res.json();
      setStocks(json.data);
      setMeta({
        total_universe: json.total_universe,
        matched_count: json.matched_count
      });
    } catch (err) {
      console.error("Gagal melakukan full scan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800">
      {/* Header & Kontrol */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-emerald-400">IDX Full Market Intelligence Scanner</h2>
          <p className="text-sm text-slate-400">Memindai seluruh emiten pasar modal secara real-time.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Min Score: {minScore}</span>
            <input 
              type="range" min="0" max="95" step="5" value={minScore} 
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="accent-emerald-500 cursor-pointer"
            />
          </div>
          <button 
            onClick={runFullScan}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition shadow-lg shadow-emerald-900/20 cursor-pointer"
          >
            {loading ? "Scanning Universe..." : "Run Full Scan"}
          </button>
        </div>
      </div>

      {/* Statistik Ringkas */}
      {meta.total_universe > 0 && (
        <div className="flex gap-6 mb-4 text-xs text-slate-400">
          <span>Total Universe: <strong className="text-white">{meta.total_universe} Emiten</strong></span>
          <span>Sinyal Valid (Score ≥ {minScore}): <strong className="text-emerald-400">{meta.matched_count} Emiten</strong></span>
        </div>
      )}

      {/* Tabel Hasil */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase z-10">
            <tr>
              <th className="py-3 px-4">Ticker</th>
              <th className="py-3 px-4">Scoring Engine</th>
              <th className="py-3 px-4">Power Meter</th>
              <th className="py-3 px-4">Bandar Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  {loading ? "Memproses data seluruh emiten..." : "Belum ada hasil scan. Klik tombol 'Run Full Scan' di atas."}
                </td>
              </tr>
            ) : (
              stocks.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-emerald-400">{item.ticker}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{item.score}</span> / 100
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${item.power_meter}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-300">{item.power_meter}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Accumulation' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded text-slate-300 transition cursor-pointer">
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}