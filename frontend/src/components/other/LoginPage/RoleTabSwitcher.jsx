// components/auth/RoleTabSwitcher.jsx

// Using 'Employer' instead of 'Institute' for clarity
const tabs = ['Candidate', 'Institute'];

const RoleTabSwitcher = ({ activeRole, setActiveRole, isDarkTheme = false }) => {
  return (
    <div className={`p-1 mb-6 rounded-lg flex space-x-1 ${isDarkTheme ? 'bg-black/20' : 'bg-gray-100'
      }`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveRole(tab)}
          className={`w-1/2 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out cursor-pointer
                      ${activeRole === tab
              ? isDarkTheme
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-blue-600 shadow-sm'
              : isDarkTheme
                ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default RoleTabSwitcher;