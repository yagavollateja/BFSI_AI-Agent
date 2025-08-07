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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2ed573;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProcessingSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ProcessingResults = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
`;

const ClaimCard = styled.div<{ status: string }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'APPROVED': return '#2ed573';
      case 'PROCESSING': return '#ffa502';
      case 'DENIED': return '#ff4757';
      default: return '#667eea';
    }
  }};
`;

const ClaimHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ClaimTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => {
    switch (props.status) {
      case 'APPROVED': return '#2ed573';
      case 'PROCESSING': return '#ffa502';
      case 'DENIED': return '#ff4757';
      default: return '#667eea';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AIInsights = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const InsightTitle = styled.h5`
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 0.9rem;
`;

const InsightText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
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
  }
`;

const RegulatorySection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RegulatoryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #ffa502;
`;

const AIClaimsProcessor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('claims');
  const [processingStats, setProcessingStats] = useState({
    totalClaims: 1247,
    autoProcessed: 892,
    pendingReview: 234,
    fraudDetected: 12,
    avgProcessingTime: '2.4 days',
    accuracyRate: 98.7
  });

  const [recentClaims] = useState([
    {
      id: 'CLM-2024-001',
      type: 'Motor Insurance',
      amount: 45000,
      status: 'APPROVED',
      confidence: 94.2,
      aiInsights: 'All documents verified. Damage assessment matches claim amount. No fraud indicators detected.',
      submittedBy: 'John Doe',
      submittedAt: '2024-01-15'
    },
    {
      id: 'CLM-2024-002',
      type: 'Health Insurance',
      amount: 125000,
      status: 'PROCESSING',
      confidence: 87.5,
      aiInsights: 'Medical records under verification. Treatment costs within normal range for procedure.',
      submittedBy: 'Sarah Smith',
      submittedAt: '2024-01-14'
    },
    {
      id: 'CLM-2024-003',
      type: 'Property Insurance',
      amount: 250000,
      status: 'DENIED',
      confidence: 96.8,
      aiInsights: 'Inconsistencies found in damage photos. Timeline mismatch detected. Requires investigation.',
      submittedBy: 'Mike Johnson',
      submittedAt: '2024-01-13'
    }
  ]);

  const [regulatoryUpdates] = useState([
    {
      title: 'IRDAI Circular - Digital Claims Processing',
      date: '2024-01-10',
      summary: 'New guidelines for AI-powered claims processing and customer consent requirements.',
      impact: 'HIGH',
      actions: ['Update consent forms', 'Implement new validation rules', 'Train staff on new procedures']
    },
    {
      title: 'RBI Guidelines - KYC for Insurance Claims',
      date: '2024-01-08',
      summary: 'Enhanced KYC requirements for high-value insurance claims processing.',
      impact: 'MEDIUM',
      actions: ['Update KYC verification process', 'Implement additional document checks']
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate AI processing
      console.log('Processing files:', files);
      // In real implementation, this would upload files and trigger AI processing
    }
  };

  return (
    <Container>
      <Header>
        <Title>🤖 AI Claims & Document Processor</Title>
        <ActionButton>📊 Generate Report</ActionButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatNumber>{processingStats.totalClaims}</StatNumber>
          <StatLabel>Total Claims</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{processingStats.autoProcessed}</StatNumber>
          <StatLabel>Auto-Processed</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{processingStats.pendingReview}</StatNumber>
          <StatLabel>Pending Review</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{processingStats.fraudDetected}</StatNumber>
          <StatLabel>Fraud Detected</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{processingStats.avgProcessingTime}</StatNumber>
          <StatLabel>Avg Processing Time</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{processingStats.accuracyRate}%</StatNumber>
          <StatLabel>AI Accuracy Rate</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab active={activeTab === 'claims'} onClick={() => setActiveTab('claims')}>
          📋 Claims Processing
        </Tab>
        <Tab active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
          📄 Document Analysis
        </Tab>
        <Tab active={activeTab === 'regulatory'} onClick={() => setActiveTab('regulatory')}>
          ⚖️ Regulatory Compliance
        </Tab>
      </TabContainer>

      {activeTab === 'claims' && (
        <>
          <ProcessingSection>
            <div>
              <h3>📤 Upload Claim Documents</h3>
              <UploadArea>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                  <div>Drop files here or click to upload</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                    Supports: PDF, Images, Word documents
                  </div>
                </label>
              </UploadArea>
            </div>

            <ProcessingResults>
              <h3>🔍 AI Processing Results</h3>
              <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2ed573' }}>✅ OCR Extraction Complete</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  • Policy Number: INS-2024-12345<br/>
                  • Claim Amount: ₹45,000<br/>
                  • Incident Date: 2024-01-10<br/>
                  • Document Confidence: 98.7%
                </p>
              </div>
              
              <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>🧠 AI Analysis</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  • Fraud Risk: Low (12%)<br/>
                  • Document Authenticity: High<br/>
                  • Policy Coverage: Valid<br/>
                  • Recommended Action: Auto-Approve
                </p>
              </div>
            </ProcessingResults>
          </ProcessingSection>

          <div>
            <h3>📋 Recent Claims</h3>
            {recentClaims.map((claim) => (
              <ClaimCard key={claim.id} status={claim.status}>
                <ClaimHeader>
                  <div>
                    <ClaimTitle>{claim.id} - {claim.type}</ClaimTitle>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Amount: ₹{claim.amount.toLocaleString()} | Submitted by: {claim.submittedBy}
                    </div>
                  </div>
                  <StatusBadge status={claim.status}>{claim.status}</StatusBadge>
                </ClaimHeader>

                <AIInsights>
                  <InsightTitle>🤖 AI Confidence: {claim.confidence}%</InsightTitle>
                  <InsightText>{claim.aiInsights}</InsightText>
                </AIInsights>

                <div style={{ marginTop: '1rem' }}>
                  <ActionButton>👁️ View Details</ActionButton>
                  <ActionButton>📝 Add Notes</ActionButton>
                  {claim.status === 'PROCESSING' && (
                    <ActionButton>✅ Approve</ActionButton>
                  )}
                </div>
              </ClaimCard>
            ))}
          </div>
        </>
      )}

      {activeTab === 'documents' && (
        <div>
          <h3>📄 Document Analysis Dashboard</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4>📊 Processing Statistics</h4>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div>• Documents Processed Today: 342</div>
                <div>• OCR Accuracy Rate: 98.7%</div>
                <div>• Auto-Extracted Fields: 15,678</div>
                <div>• Manual Review Required: 23</div>
                <div>• Average Processing Time: 1.2 seconds</div>
              </div>
            </div>
            
            <div>
              <h4>🔍 Document Types</h4>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div>• Medical Bills: 156 docs</div>
                <div>• Police Reports: 89 docs</div>
                <div>• Repair Estimates: 67 docs</div>
                <div>• Identity Proofs: 234 docs</div>
                <div>• Bank Statements: 123 docs</div>
              </div>
            </div>
          </div>

          <div>
            <h4>🚨 Anomaly Detection</h4>
            <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <strong>⚠️ Suspicious Document Detected</strong><br/>
              Document ID: DOC-2024-5678<br/>
              Issue: Potential tampering detected in medical bill<br/>
              Confidence: 94.2%<br/>
              <ActionButton style={{ marginTop: '0.5rem' }}>🔍 Investigate</ActionButton>
            </div>
            
            <div style={{ background: 'rgba(255, 165, 2, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>⚠️ Inconsistent Information</strong><br/>
              Document ID: DOC-2024-5679<br/>
              Issue: Date mismatch between incident report and claim form<br/>
              Confidence: 87.5%<br/>
              <ActionButton style={{ marginTop: '0.5rem' }}>📝 Review</ActionButton>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regulatory' && (
        <div>
          <h3>⚖️ Regulatory Compliance Dashboard</h3>
          
          <RegulatorySection>
            <h4>📢 Recent Regulatory Updates</h4>
            {regulatoryUpdates.map((update, index) => (
              <RegulatoryCard key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <strong>{update.title}</strong>
                  <StatusBadge status={update.impact}>{update.impact} IMPACT</StatusBadge>
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                  Date: {update.date}
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                  {update.summary}
                </p>
                <div>
                  <strong>Required Actions:</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                    {update.actions.map((action, actionIndex) => (
                      <li key={actionIndex} style={{ fontSize: '0.9rem' }}>{action}</li>
                    ))}
                  </ul>
                </div>
                <ActionButton style={{ marginTop: '1rem' }}>📋 Create Action Plan</ActionButton>
              </RegulatoryCard>
            ))}
          </RegulatorySection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4>✅ Compliance Status</h4>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div>• IRDAI Compliance: ✅ Current</div>
                <div>• RBI Guidelines: ✅ Current</div>
                <div>• SEBI Regulations: ✅ Current</div>
                <div>• Data Protection: ✅ Current</div>
                <div>• AML Compliance: ✅ Current</div>
              </div>
            </div>
            
            <div>
              <h4>📊 Compliance Metrics</h4>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div>• Compliance Score: 98.5%</div>
                <div>• Pending Actions: 3</div>
                <div>• Last Audit: Dec 2023</div>
                <div>• Next Review: Mar 2024</div>
                <div>• Risk Level: Low</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AIClaimsProcessor;