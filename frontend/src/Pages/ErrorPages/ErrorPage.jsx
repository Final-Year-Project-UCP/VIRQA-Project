
import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      
      {/* GIF */}
      <div className="w-full max-w-sm">
        <img
          src="https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif"
          alt="404"
          className="w-full rounded-xl shadow-sm"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-8">
        Oops! Page Not Found
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-3 text-base md:text-lg max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Button */}
      <NavLink
        to="/login"
        className="mt-6 inline-block px-7 py-3 bg-black text-white rounded-lg text-sm font-medium shadow-md hover:opacity-90 active:scale-95 transition-transform duration-150"
      >
        Go Back Home
      </NavLink>
    </div>
  );
};

export default NotFoundPage;
