// pages/Auth/Register.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query'; // Structure for later use
import RoleTabSwitcher from "../../components/other/LoginPage/RoleTabSwitcher.jsx";
import InputField from '../../components/common/InputField.jsx';
import Button from '../../components/common/Button.jsx';

// =======================================================
// PASSWORD VALIDATION LOGIC (Unique to Register Page)
// =======================================================

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    minLength,
    hasCapital,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid: minLength && hasCapital && hasLower && hasNumber && hasSpecial,
  };
};

// Component to display the checklist
const PasswordChecklist = ({ validation }) => {
  const CheckItem = ({ text, isValid }) => (
    <li className={`flex items-center text-xs ${isValid ? 'text-green-600' : 'text-red-500'}`}>
      <FiCheckCircle className={`w-4 h-4 mr-2 ${isValid ? 'opacity-100' : 'opacity-30'}`} />
      {text}
    </li>
  );

  return (
    <ul className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2">
      <CheckItem text="8+ characters" isValid={validation.minLength} />
      <CheckItem text="One Capital letter (A-Z)" isValid={validation.hasCapital} />
      <CheckItem text="One lowercase letter (a-z)" isValid={validation.hasLower} />
      <CheckItem text="One number (0-9)" isValid={validation.hasNumber} />
      <CheckItem text="One special character" isValid={validation.hasSpecial} />
    </ul>
  );
};

// =======================================================
// REGISTER PAGE COMPONENT
// =======================================================

const Register = () => {
  const [activeRole, setActiveRole] = useState('Candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validation, setValidation] = useState(validatePassword(''));
  const [error, setError] = useState(null);

  // 💡 MOCK API FUNCTION for TanStack Query (replace with real axios call later)
  const registerUser = async (credentials) => {
      console.log("Mocking registration API call...", credentials);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

      if (credentials.email === 'error@virqa.com') {
          throw new Error('Registration failed. Email already in use.');
      }
      return { success: true, message: 'Registration successful!' };
  };

  // 💡 TanStack Query Setup for Registration
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registration Successful:', data.message);
      setError(null);
      // **TODO:** Handle successful registration (e.g., show success message, redirect to email verification)
    },
    onError: (err) => {
      setError(err.message || 'Registration failed due to an unknown error.');
    },
  });

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidation(validatePassword(newPassword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!validation.isValid) {
      setError("Password does not meet all complexity requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    // Call the mutation
    registerMutation.mutate({
      role: activeRole,
      email: email,
      password: password,
      // Pass other required fields
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12">
      <div className="mb-8">
        <h2>VIRQA Registration</h2> 
      </div>
      
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        
        <RoleTabSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign up as a **{activeRole}** to join VIRQA.
        </p>

        {/* Display Error Message */}
        {(error || registerMutation.isError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error || registerMutation.error.message}</span>
            </div>
        )}
        
        {/* Display Success Message */}
        {registerMutation.isSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">Registration successful! Please check your email for verification.</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <InputField
            label="Password"
            type="password"
            placeholder="Create a password"
            icon={FiLock}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          
          {/* 💡 Password Strength Checklist */}
          {password.length > 0 && <PasswordChecklist validation={validation} />}

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            icon={FiLock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={registerMutation.isPending || !validation.isValid || password !== confirmPassword}>
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;