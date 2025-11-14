// components/auth/RoleTabSwitcher.jsx

// Using 'Employer' instead of 'Institute' for clarity
const tabs = ['Candidate', 'Institute'];

const RoleTabSwitcher = ({ activeRole, setActiveRole }) => {
  return (
    <div className="p-1 mb-6 bg-gray-100 rounded-lg flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveRole(tab)}
          className={`w-1/2 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out  cursor-pointer
                      ${activeRole === tab
                        ? 'bg-white text-blue-600 shadow-sm'
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