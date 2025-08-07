from fastapi import APIRouter

from . import auth, users, accounts, transactions, fraud_alerts, claims, claim_documents, chat, fraud, admin_profile

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["ai-chat"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["fraud-detection"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(fraud_alerts.router, prefix="/fraud-alerts", tags=["fraud-alerts"])
api_router.include_router(claims.router, prefix="/claims", tags=["claims"])
api_router.include_router(claim_documents.router, prefix="/claim-documents", tags=["claim-documents"])
api_router.include_router(admin_profile.router, prefix="/admin", tags=["admin-profile"])

