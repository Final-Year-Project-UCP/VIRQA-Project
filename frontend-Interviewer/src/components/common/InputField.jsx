// components/common/InputField.jsx (REVISED)

import { useState } from 'react';
// Import the eye icons from Feather Icons
import { FiEye, FiEyeOff } from 'react-icons/fi';

const InputField = ({ label, type = 'text', placeholder, ...props }) => {
  // 1. Local state for the password toggle
  const [showPassword, setShowPassword] = useState(false);

  // 2. Check if the input type is meant to be a password
  const isPassword = type === 'password';

  // 3. Determine the actual type of the input field to hide/show text
  const actualType = isPassword 
                     ? (showPassword ? 'text' : 'password') 
                     : type;
  
  // 4. Choose the appropriate icon for the toggle button
  const ToggleIcon = showPassword ? FiEyeOff : FiEye;


  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          // Use the dynamic 'actualType' here
          type={actualType}
          placeholder={placeholder}
          // Note: The 'pr-10' class is essential to make space for the toggle button
          className={`w-full pl-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out ${isPassword ? 'pr-10' : 'pr-4'}`}
          {...props}
        />
        
        {/*  The Password Toggle Icon (FiEye/FiEyeOff) */}
        {isPassword && (
          <button

            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition duration-150"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <ToggleIcon className="h-5 w-5" />
          </button>
        )}

      </div>
    </div>
  );
};

export default InputField;