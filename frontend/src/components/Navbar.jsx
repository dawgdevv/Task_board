import { useNavigate, useLocation } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-2xl font-bold text-white">GoalFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Auth pages now handle their own navbar content
  if (isAuthPage) {
    return null;
  }

  // Goals page and goal detail pages
  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-2xl font-bold text-white">GoalFlow</h1>
            </div>
            {location.pathname !== "/goals" && (
              <button
                onClick={() => navigate("/goals")}
                className="text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Goals
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ProfileIcon />
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
