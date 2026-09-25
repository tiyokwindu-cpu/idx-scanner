# backend/routers/scanner.py
from fastapi import APIRouter, Query
import asyncio
from idx_universe import ALL_IDX_STOCKS

router = APIRouter()

async def analyze_single_stock(ticker: str):
    # Simulasi pengambilan data & kalkulasi scoring bandarmology/power meter
    # (Ganti bagian ini dengan fungsi kalkulasi engine utama terminal Anda)
    import random
    score = round(random.uniform(40.0, 98.0), 2)
    power_meter = round(random.uniform(30.0, 99.0), 2)
    status = "Accumulation" if score > 65 else "Distribution"
    
    return {
        "ticker": ticker,
        "score": score,
        "power_meter": power_meter,
        "status": status
    }

@router.get("/api/scanner/full-market")
async def full_market_scanner(min_score: float = Query(70.0, description="Minimum score filter")):
    # Menjalankan pemindaian seluruh emiten secara paralel
    tasks = [analyze_single_stock(ticker) for ticker in ALL_IDX_STOCKS]
    results = await asyncio.gather(*tasks)
    
    # Filter hasil berdasarkan minimum skor yang diminta user
    filtered_results = [res for res in results if res["score"] >= min_score]
    
    # Urutkan dari skor tertinggi ke terendah
    filtered_results.sort(key=lambda x: x["score"], reverse=True)
    
    return {
        "total_universe": len(ALL_IDX_STOCKS),
        "matched_count": len(filtered_results),
        "data": filtered_results
    }