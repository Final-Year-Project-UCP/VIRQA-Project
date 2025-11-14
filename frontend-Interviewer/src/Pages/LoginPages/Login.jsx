// pages/Auth/AuthPage.jsx
import { NavLink } from 'react-router-dom';
import  { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import RoleTabSwitcher from "../../components/other/RoleTabSwitcher.jsx";
import InputField from '../../components/common/InputField.jsx';
import Button from '../../components/common/Button.jsx';

const Login = () => {
  // State to track the currently active role for the login
  const [activeRole, setActiveRole] = useState('Candidate');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${activeRole}`);
    // **TODO:** Implement TanStack Query mutation here
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mb-8">
       <h2>Logo</h2> {/* Place VIRQA logo/branding here */}
      </div>
      
      {/* The main white card: AuthFormContainer */}
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        
        <RoleTabSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Log in to your VIRQA {activeRole.toLowerCase()} account.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={FiMail}
          />
          
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={FiLock}
          />

          <div className="text-right">
           <NavLink 
                to="#" 
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm cursor-pointer"
            >
             Forgot Password
            </NavLink>
          </div>

          <Button type="submit">
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <NavLink 
                to="#" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
            >
             Register
            </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;