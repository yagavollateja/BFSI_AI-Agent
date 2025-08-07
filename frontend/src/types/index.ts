export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role: 'CUSTOMER' | 'ADMIN';
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  type: string;
  data?: any;
  suggestions?: string[];
}

export interface FraudAlert {
  id: string;
  transaction_id: string;
  amount: number;
  description: string;
  risk_score: number;
  risk_factors: string[];
  timestamp: string;
  status: string;
  location: string;
  merchant: string;
  priority: string;
}

export interface FraudInsights {
  total_alerts: number;
  open_alerts: number;
  confirmed_fraud: number;
  dismissed: number;
  accuracy_rate: number;
  false_positive_rate: number;
  risk_distribution: {
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
  detection_rate: number;
  trends?: {
    this_week: number;
    last_week: number;
    change_percent: number;
  };
  top_risk_factors?: Array<{
    factor: string;
    count: number;
  }>;
}
