from typing import List, Dict, Any
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.user import User
from ..crud import crud_account, crud_transaction

class AIBankingAssistant:
    def __init__(self):
        self.greetings = [
            "Hello! I'm your AI Banking Assistant. How can I help you today?",
            "Hi there! I'm here to help with your banking needs. What can I do for you?",
            "Welcome! I'm your virtual banking assistant. How may I assist you?"
        ]
    
    def process_message(self, message: str, user: User, db: Session) -> Dict[str, Any]:
        """Process user message and return appropriate response"""
        message_lower = message.lower()
        
        # Check balance inquiry
        if any(word in message_lower for word in ['balance', 'account balance', 'how much', 'money']):
            return self.get_account_balance(user, db)
        
        # Transaction history
        elif any(word in message_lower for word in ['transactions', 'history', 'recent', 'last']):
            return self.get_transaction_history(user, db)
        
        # Account information
        elif any(word in message_lower for word in ['account', 'accounts', 'info', 'information']):
            return self.get_account_info(user, db)
        
        # Help/FAQ
        elif any(word in message_lower for word in ['help', 'faq', 'support', 'assistance']):
            return self.get_help_info()
        
        # Default response with suggestions
        else:
            return {
                "response": "I'm here to help! I can assist you with:\n• Checking your account balance\n• Viewing recent transactions\n• Account information\n• General banking questions\n\nWhat would you like to know?",
                "type": "suggestion",
                "suggestions": [
                    "Check my balance",
                    "Show recent transactions",
                    "Account information",
                    "Help"
                ]
            }
    
    def get_account_balance(self, user: User, db: Session) -> Dict[str, Any]:
        """Get user's account balance"""
        accounts = crud_account.get_accounts_by_user(db, user.id)
        
        if not accounts:
            return {
                "response": "You don't have any accounts set up yet. Would you like to open an account?",
                "type": "info"
            }
        
        balance_info = []
        total_balance = 0
        
        for account in accounts:
            balance_info.append({
                "account_number": account.account_number,
                "account_type": account.account_type.value,
                "balance": float(account.balance),
                "status": account.status.value
            })
            total_balance += float(account.balance)
        
        response = f"Here are your account balances:\n"
        for info in balance_info:
            response += f"• {info['account_type']} (*{info['account_number'][-4:]}): ${info['balance']:,.2f}\n"
        response += f"\nTotal Balance: ${total_balance:,.2f}"
        
        return {
            "response": response,
            "type": "balance",
            "data": {
                "accounts": balance_info,
                "total_balance": total_balance
            }
        }
    
    def get_transaction_history(self, user: User, db: Session) -> Dict[str, Any]:
        """Get user's recent transaction history"""
        from .. import models
        
        # Get user's accounts
        accounts = crud_account.get_accounts_by_user(db, user.id)
        if not accounts:
            return {
                "response": "No accounts found. Please set up an account first.",
                "type": "info"
            }
        
        # Get recent transactions for all user accounts
        transactions = db.query(models.Transaction).filter(
            models.Transaction.account_id.in_([acc.id for acc in accounts])
        ).order_by(models.Transaction.timestamp.desc()).limit(10).all()
        
        if not transactions:
            return {
                "response": "No recent transactions found.",
                "type": "info"
            }
        
        response = "Here are your recent transactions:\n"
        transaction_data = []
        
        for txn in transactions:
            txn_data = {
                "id": str(txn.id),
                "amount": float(txn.amount),
                "description": txn.description or "Transaction",
                "category": txn.category or "General",
                "timestamp": txn.timestamp.strftime("%Y-%m-%d %H:%M"),
                "account_number": txn.account.account_number
            }
            transaction_data.append(txn_data)
            
            response += f"• {txn_data['timestamp']} - {txn_data['description']}: ${txn_data['amount']:,.2f}\n"
        
        return {
            "response": response,
            "type": "transactions",
            "data": {
                "transactions": transaction_data
            }
        }
    
    def get_account_info(self, user: User, db: Session) -> Dict[str, Any]:
        """Get user's account information"""
        accounts = crud_account.get_accounts_by_user(db, user.id)
        
        if not accounts:
            return {
                "response": "You don't have any accounts set up yet. Would you like to open an account?",
                "type": "info"
            }
        
        response = f"Account Information for {user.full_name or user.username}:\n"
        account_data = []
        
        for account in accounts:
            acc_data = {
                "account_number": account.account_number,
                "account_type": account.account_type.value,
                "balance": float(account.balance),
                "status": account.status.value,
                "created_at": account.created_at.strftime("%Y-%m-%d")
            }
            account_data.append(acc_data)
            
            response += f"• {acc_data['account_type']} Account (*{acc_data['account_number'][-4:]})\n"
            response += f"  Status: {acc_data['status']}\n"
            response += f"  Balance: ${acc_data['balance']:,.2f}\n"
            response += f"  Opened: {acc_data['created_at']}\n\n"
        
        return {
            "response": response,
            "type": "account_info",
            "data": {
                "accounts": account_data
            }
        }
    
    def get_help_info(self) -> Dict[str, Any]:
        """Get help information"""
        help_text = """I'm your AI Banking Assistant! Here's what I can help you with:

🏦 **Account Services:**
• Check account balances
• View account information
• Account status updates

💳 **Transaction Services:**
• Recent transaction history
• Transaction details
• Spending insights

❓ **Support:**
• Banking FAQs
• Contact support
• Service hours

Just ask me questions like:
• "What's my balance?"
• "Show my recent transactions"
• "Tell me about my accounts"

How can I assist you today?"""
        
        return {
            "response": help_text,
            "type": "help",
            "suggestions": [
                "Check my balance",
                "Show transactions",
                "Account info",
                "Contact support"
            ]
        }
