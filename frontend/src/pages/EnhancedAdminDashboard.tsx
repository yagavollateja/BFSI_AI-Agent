import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { fraudAPI } from '../services/api';
import { FraudAlert, FraudInsights } from '../types';
import AIClaimsProcessor from '../components/AIClaimsProcessor';
import AIBankingAssistant from '../components/AIBankingAssistant';

const Container = styled.div`
  color: white;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  gap: 2rem;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const AdminCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 300px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProfilePhoto = styled.div<{ photoUrl?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.photoUrl 
    ? `url(${props.photoUrl}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const AdminName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.3rem;
`;

const AdminTitle = styled.p`
  margin: 0 0 0.25rem 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const AdminDepartment = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  position: relative;
  overflow: hidden;
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
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

const StatTrend = styled.div<{ positive?: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: ${props => props.positive ? '#2ed573' : '#ff4757'};
  font-size: 0.9rem;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'rgba(255, 255, 255, 0.2)'};
  }
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
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TeamMemberCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MemberPhoto = styled.div<{ photoUrl?: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.photoUrl 
    ? `url(${props.photoUrl}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const MemberRole = styled.div`
  opacity: 0.7;
  font-size: 0.9rem;
`;

const StatusIndicator = styled.div<{ online?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.online ? '#2ed573' : '#ff4757'};
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
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EnhancedAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [insights, setInsights] = useState<FraudInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('fraud');

  // Mock admin profile data (in real app, fetch from API)
  const adminProfile: {
    name: string;
    title: string;
    department: string;
    employeeId: string;
    photoUrl?: string;
    yearsExperience: number;
    certifications: string[];
    accessLevel: number;
    lastLogin: string;
  } = {
    name: user?.full_name || 'John Smith',
    title: 'Senior Fraud Analyst',
    department: 'Fraud Detection',
    employeeId: 'EMP001',
    yearsExperience: 8,
    certifications: ['CAMS', 'CFE', 'ACFCS'],
    accessLevel: 4,
    lastLogin: new Date().toISOString(),
  };

  // Mock team members
  const teamMembers: Array<{
    name: string;
    role: string;
    online: boolean;
    photoUrl?: string;
  }> = [
    { name: 'Sarah Johnson', role: 'Fraud Analyst', online: true },
    { name: 'Mike Chen', role: 'Risk Specialist', online: true },
    { name: 'Emily Davis', role: 'Compliance Officer', online: false },
    { name: 'David Wilson', role: 'Security Analyst', online: true },
  ];

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading admin dashboard...</LoadingSpinner>
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
        <HeaderLeft>
          <Title>🏦 BFSI Admin Command Center</Title>
          <Subtitle>Unified AI-Powered Banking & Financial Services Management</Subtitle>
        </HeaderLeft>
        <HeaderRight>
          <AdminCard>
            <ProfileSection>
              <ProfilePhoto photoUrl={adminProfile.photoUrl}>
                {!adminProfile.photoUrl && getInitials(adminProfile.name)}
              </ProfilePhoto>
              <ProfileInfo>
                <AdminName>{adminProfile.name}</AdminName>
                <AdminTitle>{adminProfile.title}</AdminTitle>
                <AdminDepartment>{adminProfile.department}</AdminDepartment>
              </ProfileInfo>
            </ProfileSection>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              <div>ID: {adminProfile.employeeId}</div>
              <div>Experience: {adminProfile.yearsExperience} years</div>
              <div>Access Level: {adminProfile.accessLevel}/5</div>
            </div>
          </AdminCard>
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>🛡️</StatIcon>
          <StatNumber>{insights?.total_alerts || 0}</StatNumber>
          <StatLabel>Fraud Alerts</StatLabel>
          <StatTrend positive>↗ +12%</StatTrend>
        </StatCard>
        <StatCard>
          <StatIcon>🤖</StatIcon>
          <StatNumber>{insights?.accuracy_rate || 0}%</StatNumber>
          <StatLabel>AI Accuracy</StatLabel>
          <StatTrend positive>↗ +5%</StatTrend>
        </StatCard>
        <StatCard>
          <StatIcon>📊</StatIcon>
          <StatNumber>{insights?.detection_rate || 0}%</StatNumber>
          <StatLabel>Detection Rate</StatLabel>
          <StatTrend positive>↗ +8%</StatTrend>
        </StatCard>
        <StatCard>
          <StatIcon>💬</StatIcon>
          <StatNumber>1,247</StatNumber>
          <StatLabel>AI Chat Sessions</StatLabel>
          <StatTrend positive>↗ +23%</StatTrend>
        </StatCard>
        <StatCard>
          <StatIcon>📋</StatIcon>
          <StatNumber>89</StatNumber>
          <StatLabel>Claims Processed</StatLabel>
          <StatTrend positive>↗ +15%</StatTrend>
        </StatCard>
        <StatCard>
          <StatIcon>⚡</StatIcon>
          <StatNumber>99.8%</StatNumber>
          <StatLabel>System Uptime</StatLabel>
          <StatTrend positive>↗ +0.2%</StatTrend>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab active={activeTab === 'fraud'} onClick={() => setActiveTab('fraud')}>
          🛡️ Fraud Detection
        </Tab>
        <Tab active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          🤖 AI Assistant
        </Tab>
        <Tab active={activeTab === 'claims'} onClick={() => setActiveTab('claims')}>
          📋 Claims & Documents
        </Tab>
        <Tab active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')}>
          ⚖️ Compliance
        </Tab>
      </TabContainer>

      <MainContent>
        <LeftPanel>
          {activeTab === 'fraud' && (
            <Section>
              <SectionTitle>
                🚨 Real-Time Fraud Alerts
                <RefreshButton onClick={loadData}>Refresh</RefreshButton>
              </SectionTitle>
              
              {alerts.slice(0, 5).map((alert) => (
                <AlertCard key={alert.id} priority={alert.priority}>
                  <AlertHeader>
                    <AlertTitle>{alert.description}</AlertTitle>
                    <PriorityBadge priority={alert.priority}>{alert.priority}</PriorityBadge>
                  </AlertHeader>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div><strong>Amount:</strong> ${alert.amount.toLocaleString()}</div>
                    <div><strong>Merchant:</strong> {alert.merchant}</div>
                    <div><strong>Location:</strong> {alert.location}</div>
                    <div><strong>Risk Score:</strong> {(alert.risk_score * 100).toFixed(1)}%</div>
                  </div>
                </AlertCard>
              ))}
            </Section>
          )}

          {activeTab === 'ai' && (
            <AIBankingAssistant />
          )}

          {activeTab === 'claims' && (
            <AIClaimsProcessor />
          )}

          {activeTab === 'compliance' && (
            <Section>
              <SectionTitle>⚖️ Regulatory Compliance Dashboard</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                <div>
                  <h4>RBI Compliance Status</h4>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div>✅ KYC Compliance: 99.2%</div>
                    <div>✅ AML Monitoring: Active</div>
                    <div>✅ PMLA Compliance: Current</div>
                    <div>⚠️ Pending Reviews: 3</div>
                    <div>📊 Risk Score: Low</div>
                  </div>
                </div>
                <div>
                  <h4>Regulatory Updates</h4>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div>• New RBI circular on digital lending</div>
                    <div>• Updated KYC norms effective Jan 2024</div>
                    <div>• SEBI guidelines on robo-advisory</div>
                    <div>• IRDAI updates on claim settlements</div>
                    <div>• NPCI UPI transaction limits revised</div>
                  </div>
                </div>
              </div>
            </Section>
          )}
        </LeftPanel>

        <RightPanel>
          <Section>
            <SectionTitle>👥 Team Overview</SectionTitle>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index}>
                <MemberPhoto photoUrl={member.photoUrl}>
                  {!member.photoUrl && getInitials(member.name)}
                </MemberPhoto>
                <MemberInfo>
                  <MemberName>{member.name}</MemberName>
                  <MemberRole>{member.role}</MemberRole>
                </MemberInfo>
                <StatusIndicator online={member.online} />
              </TeamMemberCard>
            ))}
          </Section>

          <Section>
            <SectionTitle>⚡ Quick Actions</SectionTitle>
            <QuickActions>
              <ActionButton>
                🚨 Create Alert
              </ActionButton>
              <ActionButton>
                📊 Generate Report
              </ActionButton>
              <ActionButton>
                👤 Manage Users
              </ActionButton>
              <ActionButton>
                ⚙️ System Settings
              </ActionButton>
              <ActionButton>
                📋 Review Claims
              </ActionButton>
              <ActionButton>
                🔍 Audit Logs
              </ActionButton>
            </QuickActions>
          </Section>

          <Section>
            <SectionTitle>📈 Performance Insights</SectionTitle>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4>Today's Highlights</h4>
              <div>• Prevented $1.2M in fraudulent transactions</div>
              <div>• Processed 2,847 customer queries via AI</div>
              <div>• Completed 156 insurance claims</div>
              <div>• Maintained 99.8% system uptime</div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <h4>Certifications & Training</h4>
              <div>✅ CAMS Certified</div>
              <div>✅ CFE Certified</div>
              <div>✅ Regulatory Training: Current</div>
              <div>⏳ Next Training: Feb 15, 2024</div>
            </div>
          </Section>
        </RightPanel>
      </MainContent>
    </Container>
  );
};

export default EnhancedAdminDashboard;