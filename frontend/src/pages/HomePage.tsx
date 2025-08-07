import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  color: white;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
`;

const StyledButton = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(StyledButton)`
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: white;
    transform: translateY(-2px);
  }
`;

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>BFSI AI Assistant</Title>
      <Subtitle>Revolutionizing Support, Security, and Claims with AI</Subtitle>
      
      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI Banking Assistant</FeatureTitle>
          <FeatureDescription>
            Get instant help with account inquiries, transaction history, and personalized financial insights.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🛡️</FeatureIcon>
          <FeatureTitle>Real-time Fraud Detection</FeatureTitle>
          <FeatureDescription>
            Advanced ML algorithms monitor transactions 24/7 to detect and prevent fraudulent activities.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Intelligent Claims Processing</FeatureTitle>
          <FeatureDescription>
            Streamline insurance claims with automated document processing and smart routing.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
      
      {!user && (
        <ButtonContainer>
          <PrimaryButton to="/login">Get Started</PrimaryButton>
          <StyledButton to="/register">Sign Up</StyledButton>
        </ButtonContainer>
      )}
      
      {user && (
        <ButtonContainer>
          <PrimaryButton to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
            Go to Dashboard
          </PrimaryButton>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default HomePage;
