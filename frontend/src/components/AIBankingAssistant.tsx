import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const MetricNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #667eea;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ChatSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChatDemo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const Message = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  max-width: 80%;
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
`;

const ChatInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const AnalyticsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
`;

const QueryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InsightCard = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InsightTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #667eea;
`;

const PersonalizationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PersonalizationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
  margin-right: 0.5rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AIBankingAssistant: React.FC = () => {
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your AI Banking Assistant. How can I help you today?", isUser: false },
    { text: "What's my account balance?", isUser: true },
    { text: "Your current account balance is ₹1,25,430. Your last transaction was a debit of ₹2,500 for grocery shopping at BigBazar on Jan 14th.", isUser: false },
    { text: "Can you help me with my loan application status?", isUser: true },
    { text: "Your home loan application (Ref: HL-2024-001) is currently under review. Based on your credit score of 785 and income documents, the approval probability is 94%. Expected decision by Jan 20th.", isUser: false }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const [metrics] = useState({
    totalSessions: 12847,
    avgResponseTime: '1.3s',
    resolutionRate: 94.2,
    customerSatisfaction: 4.7,
    escalationRate: 5.8,
    languagesSupported: 12
  });

  const [topQueries] = useState([
    { query: 'Account Balance Inquiry', count: 3420, trend: '+12%' },
    { query: 'Transaction History', count: 2980, trend: '+8%' },
    { query: 'Card Activation', count: 1560, trend: '+15%' },
    { query: 'Loan Status Check', count: 1340, trend: '+5%' },
    { query: 'KYC Updates', count: 890, trend: '+22%' }
  ]);

  const [personalizedInsights] = useState([
    {
      customer: 'Premium Customer - Rajesh Kumar',
      insight: 'High-value customer showing interest in investment products. Recommend mutual funds based on risk profile.',
      action: 'Schedule Investment Consultation',
      priority: 'HIGH'
    },
    {
      customer: 'Young Professional - Priya Sharma',
      insight: 'Frequent international transactions detected. Suggest forex card and international banking services.',
      action: 'Offer Forex Solutions',
      priority: 'MEDIUM'
    },
    {
      customer: 'Senior Citizen - Mr. Gupta',
      insight: 'Regular pension deposits. Recommend senior citizen savings schemes and health insurance.',
      action: 'Senior Citizen Package',
      priority: 'MEDIUM'
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { text: newMessage, isUser: true }]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I can help you with that. Let me fetch the latest information for you.",
          "Based on your account history, here's what I found...",
          "I've processed your request. Is there anything else you'd like to know?",
          "Your request has been noted. I'll connect you with a specialist for detailed assistance."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Container>
      <Header>
        <Title>🤖 AI Banking Assistant Analytics</Title>
        <ActionButton>📊 Export Report</ActionButton>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricNumber>{metrics.totalSessions.toLocaleString()}</MetricNumber>
          <MetricLabel>Total Sessions Today</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricNumber>{metrics.avgResponseTime}</MetricNumber>
          <MetricLabel>Avg Response Time</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricNumber>{metrics.resolutionRate}%</MetricNumber>
          <MetricLabel>Resolution Rate</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricNumber>{metrics.customerSatisfaction}/5</MetricNumber>
          <MetricLabel>Customer Satisfaction</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricNumber>{metrics.escalationRate}%</MetricNumber>
          <MetricLabel>Escalation Rate</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricNumber>{metrics.languagesSupported}</MetricNumber>
          <MetricLabel>Languages Supported</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <ChatSection>
        <ChatDemo>
          <h4 style={{ margin: '0 0 1rem 0' }}>💬 Live Chat Demo</h4>
          <ChatMessages>
            {chatMessages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
          </ChatMessages>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ChatInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <ActionButton onClick={handleSendMessage}>Send</ActionButton>
          </div>
        </ChatDemo>

        <AnalyticsSection>
          <h4 style={{ margin: '0 0 1rem 0' }}>📈 Top Queries Today</h4>
          {topQueries.map((query, index) => (
            <QueryCard key={index}>
              <div>
                <div style={{ fontWeight: '600' }}>{query.query}</div>
                <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>{query.count} queries</div>
              </div>
              <div style={{ color: '#2ed573', fontWeight: '600' }}>{query.trend}</div>
            </QueryCard>
          ))}
        </AnalyticsSection>
      </ChatSection>

      <InsightCard>
        <InsightTitle>🧠 AI Performance Insights</InsightTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>Natural Language Processing</h5>
            <div>• Intent Recognition: 96.8% accuracy</div>
            <div>• Entity Extraction: 94.2% accuracy</div>
            <div>• Sentiment Analysis: 92.5% accuracy</div>
            <div>• Context Retention: 89.3% accuracy</div>
          </div>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>Knowledge Base</h5>
            <div>• Banking Products: 1,247 articles</div>
            <div>• Regulatory Updates: 456 documents</div>
            <div>• FAQ Database: 2,890 entries</div>
            <div>• Last Updated: 2 hours ago</div>
          </div>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>Integration Status</h5>
            <div>• Core Banking: ✅ Connected</div>
            <div>• CRM System: ✅ Connected</div>
            <div>• KYC Database: ✅ Connected</div>
            <div>• Fraud Detection: ✅ Connected</div>
          </div>
        </div>
      </InsightCard>

      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>🎯 Personalized Customer Insights</h3>
        <PersonalizationSection>
          {personalizedInsights.map((insight, index) => (
            <PersonalizationCard key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{insight.customer}</h4>
                <span style={{ 
                  background: insight.priority === 'HIGH' ? '#ff4757' : '#ffa502',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {insight.priority}
                </span>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: '0.9' }}>
                {insight.insight}
              </p>
              <ActionButton>{insight.action}</ActionButton>
            </PersonalizationCard>
          ))}
        </PersonalizationSection>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4>🔄 Context-Aware Handoffs</h4>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
            <div>• Total Handoffs Today: 89</div>
            <div>• Avg Context Transfer Time: 0.8s</div>
            <div>• Agent Satisfaction: 4.6/5</div>
            <div>• Customer Satisfaction: 4.4/5</div>
            <div>• Context Accuracy: 97.2%</div>
          </div>
        </div>
        
        <div>
          <h4>📱 Channel Performance</h4>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
            <div>• Web Chat: 45% (5,781 sessions)</div>
            <div>• Mobile App: 32% (4,111 sessions)</div>
            <div>• WhatsApp: 15% (1,927 sessions)</div>
            <div>• Voice Assistant: 8% (1,028 sessions)</div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AIBankingAssistant;