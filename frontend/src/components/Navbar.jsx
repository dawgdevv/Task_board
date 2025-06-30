import { useNavigate, useLocation } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <header className="bg-[var(--ctp-crust)] shadow-sm border-b border-[var(--ctp-surface0)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-2xl font-bold text-[var(--ctp-text)]">
                Taskly
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="button-primary px-6 py-2" // Use new button class
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
    <header className="bg-[var(--ctp-crust)] shadow-sm border-b border-[var(--ctp-surface0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-2xl font-bold text-[var(--ctp-text)]">
                Taskly
              </h1>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => navigate("/goals")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/goals" ||
                  location.pathname.startsWith("/goal/")
                    ? "bg-[var(--ctp-peach)] text-[var(--ctp-base)]" // Active state with vibrant color
                    : "text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] hover:bg-[var(--ctp-surface0)]"
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => navigate("/timelogs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/timelogs"
                    ? "bg-[var(--ctp-peach)] text-[var(--ctp-base)]" // Active state
                    : "text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] hover:bg-[var(--ctp-surface0)]"
                }`}
              >
                Time Logs
              </button>
            </nav>
          </div>

          {/* Center Section - Back to Goals (when not on goals page) */}
          {location.pathname !== "/goals" &&
            !location.pathname.startsWith("/goal/") &&
            location.pathname !== "/timelogs" && (
              <div className="hidden md:flex">
                <button
                  onClick={() => navigate("/goals")}
                  className="text-[var(--ctp-sky)] hover:text-[var(--ctp-teal)] flex items-center px-3 py-2 rounded-md transition-colors"
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
              </div>
            )}

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden">
              <select
                onChange={(e) => navigate(e.target.value)}
                value={location.pathname}
                className="input-field px-3 py-2 text-sm focus:ring-[var(--ctp-peach)]" // Use input-field class
              >
                <option value="/goals">Goals</option>
                <option value="/timelogs">Time Logs</option>
              </select>
            </div>

            {/* User Section */}
            <div className="hidden sm:flex items-center space-x-3">
              <ProfileIcon />
              <span className="text-[var(--ctp-subtext1)] text-sm">
                Welcome, {user?.name}
              </span>
            </div>

            {/* Mobile User Icon */}
            <div className="sm:hidden">
              <ProfileIcon />
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="button-danger px-4 py-2 text-sm font-medium" // Use new button-danger class
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
