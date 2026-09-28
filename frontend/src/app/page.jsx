'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function CommandCenter() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [scanningStatus, setScanningStatus] = useState('Idle');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://idx-scanner-backend.onrender.com';
  
  const fetchScanData = async () => {
    setLoading(true);
    setScanningStatus('Scanning IDX Universe...');
    try {
      const res = await fetch(API_URL + '/api/scan');
      const json = await res.json();
      setMarketData(Array.isArray(json) ? json : (json.data || []));
      setLastUpdated(new Date().toLocaleTimeString());
      setScanningStatus('Completed');
    } catch (err) {
      setScanningStatus('Connection Error');
      setMarketData([
        { ticker: 'BBCA', name: 'Bank Central Asia Tbk', sector: 'Financials', price: 9850, change: 1.54, score: 92, whale_signal: 'Strong Buy' },
        { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials', price: 4420, change: -0.67, score: 85, whale_signal: 'Accumulate' }
      ]);
    } finally { 
      setLoading(false); 
    }
  };
  
  useEffect(() => { 
    fetchScanData(); 
  }, []);
  
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans p-6">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <h1 className="text-xl font-bold font-mono">
          IDX QUANT <span className="text-emerald-400">COMMAND CENTER</span>
        </h1>
        <button 
          onClick={fetchScanData} 
          disabled={loading} 
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <RefreshCw className={"w-4 h-4 " + (loading ? "animate-spin" : "")} />
          {loading ? 'SCANNING...' : 'RUN FULL SCAN'}
        </button>
      </header>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden p-4">
        <p className="font-mono text-sm text-slate-400 mb-4">
          Status: {scanningStatus} | Last Sync: {lastUpdated || '-'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="p-3">Ticker</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Change</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {marketData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold">
                    {item.ticker} 
                    <div className="text-xs text-slate-400 font-sans font-normal">{item.name}</div>
                  </td>
                  <td className="p-3 text-xs text-slate-400">{item.sector}</td>
                  <td className="p-3 text-right font-bold">
                    {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : item.price}
                  </td>
                  <td className={"p-3 text-right font-bold " + (item.change >= 0 ? "text-emerald-400" : "text-rose-500")}>
                    {item.change > 0 ? "+" + item.change : item.change}%
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded text-xs">
                      {item.score}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                      {item.whale_signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}