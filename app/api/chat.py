from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from ..api.auth import get_current_user
from ..services.ai_chat_service import AIBankingAssistant
from ..models.user import User
from .deps import get_db

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    type: str
    data: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None

# Initialize AI assistant
ai_assistant = AIBankingAssistant()

@router.post("/message", response_model=ChatResponse)
def chat_message(
    chat_msg: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process chat message and return AI response"""
    try:
        response = ai_assistant.process_message(chat_msg.message, current_user, db)
        return ChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.get("/greeting", response_model=ChatResponse)
def get_greeting(current_user: User = Depends(get_current_user)):
    """Get a personalized greeting for the user"""
    import random
    
    greeting = random.choice(ai_assistant.greetings)
    personalized_greeting = f"Hello {current_user.full_name or current_user.username}! {greeting}"
    
    return ChatResponse(
        response=personalized_greeting,
        type="greeting",
        suggestions=[
            "Check my balance",
            "Show recent transactions",
            "Account information",
            "Help"
        ]
    )
