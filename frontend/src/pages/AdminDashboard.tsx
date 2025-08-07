import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { fraudAPI } from '../services/api';
import { FraudAlert, FraudInsights } from '../types';

const Container = styled.div`
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const AlertsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AlertCard = styled.div<{ priority?: string }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'HIGH': return '#ff4757';
      case 'MEDIUM': return '#ffa502';
      default: return '#2ed573';
    }
  }};
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const PriorityBadge = styled.span<{ priority?: string }>`
  background: ${props => {
    switch (props.priority) {
      case 'HIGH': return '#ff4757';
      case 'MEDIUM': return '#ffa502';
      default: return '#2ed573';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AlertDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AlertDetail = styled.div`
  opacity: 0.9;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
`;

const RiskScore = styled.div<{ score: number }>`
  background: ${props => {
    if (props.score >= 0.8) return 'rgba(255, 71, 87, 0.2)';
    if (props.score >= 0.5) return 'rgba(255, 165, 2, 0.2)';
    return 'rgba(46, 213, 115, 0.2)';
  }};
  color: ${props => {
    if (props.score >= 0.8) return '#ff4757';
    if (props.score >= 0.5) return '#ffa502';
    return '#2ed573';
  }};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const RiskFactors = styled.div`
  margin-top: 1rem;
`;

const FactorTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AdminDashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [insights, setInsights] = useState<FraudInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [alertsData, insightsData] = await Promise.all([
        fraudAPI.getSampleAlerts(10),
        fraudAPI.getInsights()
      ]);
      
      setAlerts(alertsData);
      setInsights(insightsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load fraud data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading fraud detection data...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          {error}
          <br />
          <RefreshButton onClick={loadData} style={{ marginTop: '1rem' }}>
            Try Again
          </RefreshButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Fraud Detection Center 🛡️</Title>
        <Subtitle>Real-time monitoring and analysis</Subtitle>
      </Header>

      {insights && (
        <StatsGrid>
          <StatCard>
            <StatNumber>{insights.total_alerts}</StatNumber>
            <StatLabel>Total Alerts</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{insights.open_alerts}</StatNumber>
            <StatLabel>Open Alerts</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{insights.accuracy_rate}%</StatNumber>
            <StatLabel>Accuracy Rate</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{insights.detection_rate}%</StatNumber>
            <StatLabel>Detection Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <AlertsSection>
        <SectionTitle>
          🚨 Recent Fraud Alerts
          <RefreshButton onClick={loadData}>Refresh</RefreshButton>
        </SectionTitle>
        
        {alerts.map((alert) => (
          <AlertCard key={alert.id} priority={alert.priority}>
            <AlertHeader>
              <AlertTitle>{alert.description}</AlertTitle>
              <PriorityBadge priority={alert.priority}>{alert.priority}</PriorityBadge>
            </AlertHeader>
            
            <AlertDetails>
              <AlertDetail>
                <DetailLabel>Amount:</DetailLabel>
                ${alert.amount.toLocaleString()}
              </AlertDetail>
              <AlertDetail>
                <DetailLabel>Merchant:</DetailLabel>
                {alert.merchant}
              </AlertDetail>
              <AlertDetail>
                <DetailLabel>Location:</DetailLabel>
                {alert.location}
              </AlertDetail>
              <AlertDetail>
                <DetailLabel>Time:</DetailLabel>
                {alert.timestamp}
              </AlertDetail>
            </AlertDetails>
            
            <RiskScore score={alert.risk_score}>
              Risk Score: {(alert.risk_score * 100).toFixed(1)}%
            </RiskScore>
            
            <RiskFactors>
              <DetailLabel>Risk Factors:</DetailLabel>
              <div>
                {alert.risk_factors.map((factor, index) => (
                  <FactorTag key={index}>{factor}</FactorTag>
                ))}
              </div>
            </RiskFactors>
          </AlertCard>
        ))}
      </AlertsSection>
    </Container>
  );
};

export default AdminDashboard;

