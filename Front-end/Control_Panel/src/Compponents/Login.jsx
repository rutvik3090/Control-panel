import React, { useState } from 'react';
import styled from 'styled-components';
import { loginUser } from './Api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  max-width: 400px;
`;

const StyledForm = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(formData);
      console.log('Login successful:', data);
      // Redirect to Dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data?.error || err.message);
    }
  };

  return (
    <PageContainer>
      <h2>Login</h2>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <StyledInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <StyledButton type="submit">Login</StyledButton>
      </StyledForm>
    </PageContainer>
  );
};

export default Login;
