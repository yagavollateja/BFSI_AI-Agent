import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChatResponse } from '../types';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  color: white;
  max-width: 800px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ChatContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BotAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div<{ isUser?: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 1rem;
  border-radius: 16px;
  max-width: 70%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  line-height: 1.5;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SuggestionChip = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 1rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 1rem;
  
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #667eea;
    animation: loading 1.4s infinite both;
  }
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #667eea;
    animation: loading 1.4s infinite both;
    animation-delay: 0.2s;
    margin-right: 4px;
  }
  
  @keyframes loading {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }
`;

interface ChatMessage {
  text: string;
  isUser: boolean;
  suggestions?: string[];
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial greeting
    const loadGreeting = async () => {
      try {
        const response = await chatAPI.getGreeting();
        setMessages([{
          text: response.response,
          isUser: false,
          suggestions: response.suggestions
        }]);
        if (response.suggestions) {
          setSuggestions(response.suggestions);
        }
      } catch (error) {
        console.error('Failed to load greeting:', error);
      }
    };

    loadGreeting();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const response = await chatAPI.sendMessage(message);
      const botMessage = {
        text: response.response,
        isUser: false,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, botMessage]);
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting to the server. Please try again.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <Container>
      <WelcomeCard>
        <Title>Welcome, {user?.full_name || user?.username}! 👋</Title>
        <Subtitle>Your AI Banking Assistant is ready to help</Subtitle>
      </WelcomeCard>

      <ChatContainer>
        <ChatHeader>
          <BotAvatar>🤖</BotAvatar>
          <ChatTitle>AI Banking Assistant</ChatTitle>
        </ChatHeader>

        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
          {loading && (
            <Message>
              <MessageBubble>
                <LoadingDots />
              </MessageBubble>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>

        {suggestions.length > 0 && (
          <SuggestionsContainer>
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionChip>
            ))}
          </SuggestionsContainer>
        )}

        <ChatInputContainer>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <ChatInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about your accounts, transactions, or anything else..."
              disabled={loading}
            />
            <SendButton type="submit" disabled={loading || !input.trim()}>
              Send
            </SendButton>
          </form>
        </ChatInputContainer>
      </ChatContainer>
    </Container>
  );
};

export default CustomerDashboard;

