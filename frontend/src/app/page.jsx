'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [stocks, setStocks] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [macroMatrix, setMacroMatrix] = useState([]);
  const [newsFeed, setNewsFeed] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [backtestData, setBacktestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [meta, setMeta] = useState({ total_universe: 0, matched_count: 0 });
  
  const [buyTicker, setBuyTicker] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyLots, setBuyLots] = useState('');

  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [telegramStatus, setTelegramStatus] = useState(false);

  const fetchData = async (scoreThreshold) => {
    setLoading(true);
    try {
      // 1. Fetch Scanner & Heatmap
      const res = await fetch(`http://localhost:8000/api/scanner/full-market?min_score=${scoreThreshold}`);
      const json = await res.json();
      setStocks(json.data || []);
      setHeatmap(json.sector_heatmap || []);
      setMeta({ total_universe: json.total_universe || 0, matched_count: json.matched_count || 0 });

      // 2. Fetch Macro Correlation
      const macroRes = await fetch('http://localhost:8000/api/macro/correlation');
      const macroJson = await macroRes.json();
      setMacroMatrix(macroJson.macro_matrix || []);

      // 3. Fetch Real-time News & Rumors (Right Issue / Corporate Actions)
      const newsRes = await fetch('http://localhost:8000/api/news/realtime');
      const newsJson = await newsRes.json();
      setNewsFeed(newsJson.news_feed || []);

      // 4. Fetch Portfolio
      const portRes = await fetch('http://localhost:8000/api/portfolio');
      const portJson = await portRes.json();
      setPortfolio(portJson.portfolio || []);

      // 5. Fetch Backtest Lab
      const btRes = await fetch('http://localhost:8000/api/backtest/run');
      const btJson = await btRes.json();
      setBacktestData(btJson.backtest_summary || []);
    } catch (err) {
      console.error("Gagal terhubung ke backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(minScore);
  }, [minScore]);

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!buyTicker || !buyPrice || !buyLots) return;
    await fetch('http://localhost:8000/api/portfolio/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker: buyTicker.toUpperCase(), buy_price: Number(buyPrice), lots: Number(buyLots) })
    });
    setBuyTicker(''); setBuyPrice(''); setBuyLots('');
    fetchData(minScore);
  };

  const handleSaveTelegram = async () => {
    await fetch('http://localhost:8000/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bot_token: botToken, chat_id: chatId, active: true })
    });
    setTelegramStatus(true);
    alert("Telegram Bot Auto-Alerts berhasil diaktifkan!");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '15px', color: '#38bdf8', fontWeight: 'bold' }}>IDX QUANT TERMINAL</h2>
          <span style={{ fontSize: '11px', color: '#34d399' }}>● Institutional Grade</span>
        </div>

        <nav style={{ padding: '15px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { id: 'scanner', label: '📊 Multibagger Scanner', desc: 'Real-time whale accumulation' },
            { id: 'news', label: '📰 News & Right Issue', desc: 'Rumor & corporate action feed' },
            { id: 'heatmap', label: '🗺️ Sector Rotation', desc: 'Heatmap matrix sektoral' },
            { id: 'macro', label: '🌐 Cross-Market Macro', desc: 'Komoditas & USD/IDR' },
            { id: 'backtest', label: '📈 Backtest Lab', desc: 'Statistik uji historis' },
            { id: 'portfolio', label: '💼 Virtual Portfolio', desc: 'Paper trading journal' },
            { id: 'telegram', label: '📡 Telegram Alerts', desc: 'Webhook push notification' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 15px',
                backgroundColor: activeTab === item.id ? '#1e293b' : 'transparent',
                color: activeTab === item.id ? '#38bdf8' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              <div>{item.label}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #1e293b' }}>
          <div>
            <h1 style={{ fontSize: '20px', color: '#fff', textTransform: 'capitalize' }}>
              {activeTab === 'scanner' && 'Real-Time Multibagger Hunter'}
              {activeTab === 'news' && 'Real-Time News, Rumors & Corporate Actions'}
              {activeTab === 'heatmap' && 'Sector Rotation & Momentum Heatmap'}
              {activeTab === 'macro' && 'Cross-Market Global Correlation'}
              {activeTab === 'backtest' && 'Strategy Backtesting Performance Lab'}
              {activeTab === 'portfolio' && 'Virtual Portfolio & Position Sizing'}
              {activeTab === 'telegram' && 'Telegram Bot Auto-Alerts Configuration'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '3px' }}>Connected to IDX Universe • Powered by Quantitative Engine</p>
          </div>
          <button 
            onClick={() => fetchData(minScore)}
            style={{ padding: '8px 15px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            🔄 Refresh All Data
          </button>
        </div>

        {/* Tab 1: Scanner */}
        {activeTab === 'scanner' && (
          <div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Min Score Filter: <strong>{minScore}</strong>
                </label>
                <input type="range" min="0" max="90" step="5" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#34d399' }}>
                {loading ? "Menganalisis pasar..." : `Menampilkan ${meta.matched_count} dari ${meta.total_universe} emiten`}
              </div>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '12px' }}>Ticker</th>
                    <th style={{ padding: '12px' }}>Sektor</th>
                    <th style={{ padding: '12px' }}>Harga Live</th>
                    <th style={{ padding: '12px' }}>Score</th>
                    <th style={{ padding: '12px' }}>Astronacci Target</th>
                    <th style={{ padding: '12px' }}>Order Book Bid vs Ask</th>
                    <th style={{ padding: '12px' }}>Tape Reading Status</th>
                    <th style={{ padding: '12px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Tidak ada emiten yang memenuhi kriteria.</td></tr>
                  ) : (
                    stocks.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#38bdf8' }}>{item.ticker}</td>
                        <td style={{ padding: '12px', color: '#94a3b8' }}>{item.sector}</td>
                        <td style={{ padding: '12px' }}>Rp {item.close_price?.toLocaleString()}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: item.score >= 75 ? '#f59e0b' : '#fff' }}>{item.score}</td>
                        <td style={{ padding: '12px', color: '#34d399', fontWeight: 'bold' }}>Rp {item.astronacci_target?.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '10px' }}>
                            <span style={{ color: '#34d399' }}>Bid: {item.bid_pressure}%</span>
                            <span style={{ color: '#f87171' }}>Ask: {item.ask_pressure}%</span>
                          </div>
                          <div style={{ width: '100%', height: '5px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.bid_pressure}%`, height: '100%', backgroundColor: '#34d399' }}></div>
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: '#38bdf8', fontSize: '11px' }}>{item.order_book_status}</td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => { setBuyTicker(item.ticker); setBuyPrice(item.close_price); setBuyLots(10); setActiveTab('portfolio'); }}
                            style={{ padding: '4px 8px', backgroundColor: '#34d399', color: '#000', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            + Beli
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: News & Corporate Actions */}
        {activeTab === 'news' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '15px 20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '4px' }}>⚠️ Peringatan Intelijen Pasar</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Modul ini memantau rumor right issue, private placement, aksi korporasi, dan sentimen berita institusional secara real-time.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px' }}>
              {newsFeed.length === 0 ? (
                <div style={{ color: '#64748b', padding: '30px', textAlign: 'center', gridColumn: '1 / -1' }}>Memuat feed berita atau backend belum merespons...</div>
              ) : (
                newsFeed.map((news) => (
                  <div key={news.id} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ backgroundColor: '#0ea5e9', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{news.ticker}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{news.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold', marginBottom: '6px' }}>[{news.category}]</div>
                      <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '8px', lineHeight: '1.4' }}>{news.title}</h4>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '15px' }}>{news.summary}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '10px', fontSize: '11px' }}>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>Dampak: {news.impact}</span>
                      <span style={{ color: '#64748b' }}>{news.source}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Sector Heatmap */}
        {activeTab === 'heatmap' && (
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px' }}>Sector Rotation Heatmap Matrix</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {heatmap.map((sec, idx) => (
                <div key={idx} style={{ backgroundColor: sec.average_score >= 70 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(51, 65, 85, 0.5)', border: '1px solid #334155', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>{sec.sector}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399', margin: '8px 0' }}>Score {sec.average_score}</div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{sec.active_stocks} Emiten Terdeteksi Aktif</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Macro Correlation */}
        {activeTab === 'macro' && (
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px' }}>Cross-Market Correlation Matrix</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '12px' }}>Aset Global / Domestik</th>
                  <th style={{ padding: '12px' }}>Kategori</th>
                  <th style={{ padding: '12px' }}>Korelasi ke IDX</th>
                  <th style={{ padding: '12px' }}>Tren Makro</th>
                  <th style={{ padding: '12px' }}>Dampak Fundamental</th>
                </tr>
              </thead>
              <tbody>
                {macroMatrix.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>{m.asset}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{m.category}</td>
                    <td style={{ padding: '12px', color: '#34d399', fontWeight: 'bold' }}>{m.correlation_to_idx}</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>{m.trend}</td>
                    <td style={{ padding: '12px', color: '#f59e0b', fontSize: '12px' }}>{m.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Backtest Lab */}
        {activeTab === 'backtest' && (
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px' }}>Strategy Backtesting Performance Lab (6M Historical)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '12px' }}>Strategi Algoritma</th>
                  <th style={{ padding: '12px' }}>Periode Uji</th>
                  <th style={{ padding: '12px' }}>Win Rate</th>
                  <th style={{ padding: '12px' }}>Avg Return</th>
                  <th style={{ padding: '12px' }}>Status Keyakinan</th>
                </tr>
              </thead>
              <tbody>
                {backtestData.map((bt, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>{bt.strategy}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{bt.tested_period}</td>
                    <td style={{ padding: '12px', color: '#34d399', fontWeight: 'bold' }}>{bt.win_rate_pct}%</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>+{bt.avg_return_pct}%</td>
                    <td style={{ padding: '12px', color: '#f59e0b' }}>{bt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Virtual Portfolio */}
        {activeTab === 'portfolio' && (
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px' }}>Virtual Portfolio &amp; Paper Trading Journal</h3>
            <form onSubmit={handleAddPortfolio} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input type="text" placeholder="Ticker (Cth: BBRI)" value={buyTicker} onChange={(e)=>setBuyTicker(e.target.value)} style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', width: '140px', fontSize: '12px' }} />
              <input type="number" placeholder="Harga Masuk" value={buyPrice} onChange={(e)=>setBuyPrice(e.target.value)} style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', width: '150px', fontSize: '12px' }} />
              <input type="number" placeholder="Jumlah Lot" value={buyLots} onChange={(e)=>setBuyLots(e.target.value)} style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', width: '120px', fontSize: '12px' }} />
              <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#34d399', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Tambah Posisi</button>
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '12px' }}>Ticker</th>
                  <th style={{ padding: '12px' }}>Harga Masuk</th>
                  <th style={{ padding: '12px' }}>Jumlah Lot</th>
                  <th style={{ padding: '12px' }}>Waktu Eksekusi</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Belum ada posisi di portofolio virtual. Pilih emiten dari scanner untuk mulai simulasi beli.</td></tr>
                ) : (
                  portfolio.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#38bdf8' }}>{p.ticker}</td>
                      <td style={{ padding: '12px' }}>Rp {p.buy_price.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{p.lots} Lot</td>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>{p.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 7: Telegram Bot Config */}
        {activeTab === 'telegram' && (
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '10px' }}>Telegram Bot Webhook Integration</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Masukkan kredensial Telegram Bot Anda untuk menerima push notification sinyal Stealth Accumulation secara otomatis.</p>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>Bot Token</label>
              <input 
                type="text" placeholder="Contoh: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" value={botToken} onChange={(e)=>setBotToken(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>Chat ID / Channel ID</label>
              <input 
                type="text" placeholder="Contoh: -100123456789" value={chatId} onChange={(e)=>setChatId(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
              />
            </div>
            <button onClick={handleSaveTelegram} style={{ width: '100%', padding: '12px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              {telegramStatus ? "✅ Bot Berhasil Terhubung & Aktif" : "Simpan & Aktifkan Auto-Alerts"}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}