from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.api import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BFSI AI Assistant API",
    description="API for the Unified AI Assistant for Financial Institutions",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the BFSI AI Assistant API"}

app.include_router(api_router, prefix="/api/v1")
