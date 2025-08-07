"""
Script to run the AI Banking Assistant chat service
"""
from app.services.ai_chat_service import AIBankingAssistant

def main():
    # Initialize the AI Banking Assistant
    ai_assistant = AIBankingAssistant()
    
    # Print the greeting messages
    print("\n=== AI BANKING ASSISTANT ===\n")
    print("Available greeting messages:")
    for i, greeting in enumerate(ai_assistant.greetings, 1):
        print(f"{i}. {greeting}")
    
    print("\n=== HELP INFORMATION ===\n")
    help_info = ai_assistant.get_help_info()
    print(help_info["response"])
    
    print("\n=== SUGGESTED ACTIONS ===\n")
    for suggestion in help_info["suggestions"]:
        print(f"- {suggestion}")

if __name__ == "__main__":
    main()