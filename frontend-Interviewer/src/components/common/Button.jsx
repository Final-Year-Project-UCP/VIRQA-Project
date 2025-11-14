// components/common/Button.jsx

const Button = ({ children, type = 'button', onClick, variant = 'primary', ...props }) => {
  const baseStyle = 'w-full py-2 px-4 rounded-md font-semibold transition duration-150 ease-in-out shadow-md';
  let variantStyle = '';

  // Enforcing the same blue theme color
  if (variant === 'primary') {
    variantStyle = 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300';
  } else if (variant === 'secondary') {
    // Example for a potential secondary button
    variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;