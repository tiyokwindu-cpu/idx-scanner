from concurrent.futures import ThreadPoolExecutor, as_completed
import yfinance as yf

def scan_full_market(tickers):
    results = []
    
    def process_ticker(ticker):
        try:
            # Mengambil data historis singkat untuk kalkulasi teknikal & whale radar
            stock = yf.Ticker(ticker)
            df = stock.history(period="3mo")
            if df.empty or len(df) < 20:
                return None
            
            # Logika Scoring & Deteksi Whale di sini...
            score = 85.0 # Contoh hasil scoring
            return {"ticker": ticker, "score": score, "status": "ACCUMULATION"}
        except Exception:
            return None

    # Menjalankan pemindaian secara paralel (multi-threaded) agar cepat
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(process_ticker, t): t for t in tickers}
        for future in as_completed(futures):
            res = future.result()
            if res:
                results.append(res)
                
    return results