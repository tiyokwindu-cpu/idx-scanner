# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.scanner import router as scanner_router

app = FastAPI(title="IDX Big Investor Intelligence API")

# Konfigurasi CORS jika frontend dan backend terpisah port-nya
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Daftarkan Router Scanner
app.include_router(scanner_router)

@app.get("/")
def root():
    return {"message": "IDX Intelligence Backend Running Successfully"}
