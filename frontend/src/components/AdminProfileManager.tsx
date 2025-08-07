import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProfilePhoto = styled.div<{ photoUrl?: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.photoUrl 
    ? `url(${props.photoUrl}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PhotoUploadButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BasicInfo = styled.div`
  flex: 1;
`;

const Name = styled.h2`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  opacity: 0.8;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  border-bottom: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #2c3e50;
    color: white;
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CertificationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CertificationTag = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff4757;
  }
`;

const AddButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #667eea;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #2ed573 0%, #17a2b8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s ease;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

interface AdminProfileManagerProps {
  adminData?: any;
  onSave?: (data: any) => void;
}

const AdminProfileManager: React.FC<AdminProfileManagerProps> = ({ adminData, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: adminData?.full_name || '',
    email: adminData?.email || '',
    employeeId: adminData?.employee_id || '',
    phoneNumber: adminData?.phone_number || '',
    
    // Professional Info
    jobTitle: adminData?.job_title || '',
    department: adminData?.department || '',
    positionLevel: adminData?.position_level || '',
    yearsExperience: adminData?.years_experience || '',
    officeLocation: adminData?.office_location || '',
    
    // Banking Specific
    bankingCertifications: adminData?.banking_certifications || [],
    specializations: adminData?.specializations || [],
    languagesSpoken: adminData?.languages_spoken || '',
    securityClearanceLevel: adminData?.security_clearance_level || '',
    
    // Education & Background
    educationBackground: adminData?.education_background || '',
    previousInstitutions: adminData?.previous_institutions || [],
    achievements: adminData?.achievements || [],
    bio: adminData?.bio || '',
    
    // Emergency Contact
    emergencyContactName: adminData?.emergency_contact_name || '',
    emergencyContactPhone: adminData?.emergency_contact_phone || '',
  });

  const [newCertification, setNewCertification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        bankingCertifications: [...prev.bankingCertifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bankingCertifications: prev.bankingCertifications.filter((_: string, i: number) => i !== index)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_: string, i: number) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <PhotoSection>
          <ProfilePhoto photoUrl={adminData?.profile_photo_url}>
            {!adminData?.profile_photo_url && getInitials(formData.fullName || 'Admin User')}
          </ProfilePhoto>
          <PhotoUploadButton>📷 Upload Photo</PhotoUploadButton>
        </PhotoSection>
        
        <BasicInfo>
          <Name>{formData.fullName || 'Admin User'}</Name>
          <Title>{formData.jobTitle || 'Banking Professional'}</Title>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Employee ID</InfoLabel>
              <InfoValue>{formData.employeeId || 'Not Set'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Department</InfoLabel>
              <InfoValue>{formData.department || 'Not Set'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Experience</InfoLabel>
              <InfoValue>{formData.yearsExperience ? `${formData.yearsExperience} years` : 'Not Set'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Security Clearance</InfoLabel>
              <InfoValue>{formData.securityClearanceLevel || 'Standard'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </BasicInfo>
      </ProfileHeader>

      <TabContainer>
        <Tab active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
          👤 Basic Info
        </Tab>
        <Tab active={activeTab === 'professional'} onClick={() => setActiveTab('professional')}>
          💼 Professional
        </Tab>
        <Tab active={activeTab === 'banking'} onClick={() => setActiveTab('banking')}>
          🏦 Banking Expertise
        </Tab>
        <Tab active={activeTab === 'education'} onClick={() => setActiveTab('education')}>
          🎓 Education & Background
        </Tab>
        <Tab active={activeTab === 'emergency'} onClick={() => setActiveTab('emergency')}>
          🚨 Emergency Contact
        </Tab>
      </TabContainer>

      {activeTab === 'basic' && (
        <FormSection>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Employee ID</Label>
            <Input
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              placeholder="Enter employee ID"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
            />
          </FormGroup>
        </FormSection>
      )}

      {activeTab === 'professional' && (
        <FormSection>
          <FormGroup>
            <Label>Job Title</Label>
            <Input
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="Enter job title"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Department</Label>
            <Select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="FRAUD_DETECTION">Fraud Detection</option>
              <option value="RISK_MANAGEMENT">Risk Management</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="CLAIMS_PROCESSING">Claims Processing</option>
              <option value="CUSTOMER_SERVICE">Customer Service</option>
              <option value="IT_SECURITY">IT Security</option>
              <option value="OPERATIONS">Operations</option>
              <option value="AUDIT">Audit</option>
              <option value="REGULATORY_AFFAIRS">Regulatory Affairs</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Position Level</Label>
            <Select
              value={formData.positionLevel}
              onChange={(e) => handleInputChange('positionLevel', e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="JUNIOR_ANALYST">Junior Analyst</option>
              <option value="SENIOR_ANALYST">Senior Analyst</option>
              <option value="TEAM_LEAD">Team Lead</option>
              <option value="MANAGER">Manager</option>
              <option value="SENIOR_MANAGER">Senior Manager</option>
              <option value="DIRECTOR">Director</option>
              <option value="VP">Vice President</option>
              <option value="SVP">Senior Vice President</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Years of Experience</Label>
            <Input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
              placeholder="Enter years of experience"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Office Location</Label>
            <Input
              value={formData.officeLocation}
              onChange={(e) => handleInputChange('officeLocation', e.target.value)}
              placeholder="Enter office location"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Security Clearance Level</Label>
            <Select
              value={formData.securityClearanceLevel}
              onChange={(e) => handleInputChange('securityClearanceLevel', e.target.value)}
            >
              <option value="">Select Clearance Level</option>
              <option value="Standard">Standard</option>
              <option value="Confidential">Confidential</option>
              <option value="Secret">Secret</option>
              <option value="Top Secret">Top Secret</option>
            </Select>
          </FormGroup>
        </FormSection>
      )}

      {activeTab === 'banking' && (
        <FormSection>
          <FormGroup>
            <Label>Banking Certifications</Label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification (e.g., CAMS, CFE, ACFCS)"
                style={{ flex: 1 }}
              />
              <AddButton onClick={addCertification}>Add</AddButton>
            </div>
            <CertificationContainer>
              {formData.bankingCertifications.map((cert: string, index: number) => (
                <CertificationTag key={index}>
                  {cert}
                  <RemoveButton onClick={() => removeCertification(index)}>×</RemoveButton>
                </CertificationTag>
              ))}
            </CertificationContainer>
          </FormGroup>
          
          <FormGroup>
            <Label>Specializations</Label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization (e.g., AML, KYC, Credit Risk)"
                style={{ flex: 1 }}
              />
              <AddButton onClick={addSpecialization}>Add</AddButton>
            </div>
            <CertificationContainer>
              {formData.specializations.map((spec: string, index: number) => (
                <CertificationTag key={index}>
                  {spec}
                  <RemoveButton onClick={() => removeSpecialization(index)}>×</RemoveButton>
                </CertificationTag>
              ))}
            </CertificationContainer>
          </FormGroup>
          
          <FormGroup>
            <Label>Languages Spoken</Label>
            <Input
              value={formData.languagesSpoken}
              onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
              placeholder="Enter languages (e.g., English, Hindi, Tamil)"
            />
          </FormGroup>
        </FormSection>
      )}

      {activeTab === 'education' && (
        <FormSection>
          <FormGroup>
            <Label>Education Background</Label>
            <TextArea
              value={formData.educationBackground}
              onChange={(e) => handleInputChange('educationBackground', e.target.value)}
              placeholder="Enter education details (degrees, institutions, years)"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Professional Bio</Label>
            <TextArea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Enter professional biography"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Key Achievements</Label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add achievement"
                style={{ flex: 1 }}
              />
              <AddButton onClick={addAchievement}>Add</AddButton>
            </div>
            <CertificationContainer>
              {formData.achievements.map((achievement: string, index: number) => (
                <CertificationTag key={index}>
                  {achievement}
                  <RemoveButton onClick={() => removeAchievement(index)}>×</RemoveButton>
                </CertificationTag>
              ))}
            </CertificationContainer>
          </FormGroup>
        </FormSection>
      )}

      {activeTab === 'emergency' && (
        <FormSection>
          <FormGroup>
            <Label>Emergency Contact Name</Label>
            <Input
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              placeholder="Enter emergency contact name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Emergency Contact Phone</Label>
            <Input
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              placeholder="Enter emergency contact phone"
            />
          </FormGroup>
        </FormSection>
      )}

      <SaveButton onClick={handleSave}>
        💾 Save Profile Changes
      </SaveButton>
    </ProfileContainer>
  );
};

export default AdminProfileManager;