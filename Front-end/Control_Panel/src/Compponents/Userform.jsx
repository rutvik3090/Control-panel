// /src/components/UserForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { createUser } from './Api';

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const UserForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            onSuccess();
            setFormData({ username: '', email: '', password: '' });
        } catch (err) {
            console.error('Error creating user:', err.message);
        }
    };

    return (
        <FormContainer>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <StyledInput
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
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
                <StyledButton type="submit">Create User</StyledButton>
            </form>
        </FormContainer>
    );
};

export default UserForm;
