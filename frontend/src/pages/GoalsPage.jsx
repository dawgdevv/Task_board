import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const GoalsPage = () => {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    priority: "medium",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchGoals();
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await fetchGoals();
        setFormData({
          title: "",
          description: "",
          targetDate: "",
          priority: "medium",
          category: "",
        });
        setShowCreateGoal(false);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal");
    }
  };

  const handleGoalClick = (goalId) => {
    navigate(`/goal/${goalId}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-900 text-red-300";
      case "medium":
        return "bg-yellow-900 text-yellow-300";
      case "low":
        return "bg-green-900 text-green-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Add this function to format description text
  const formatDescription = (description) => {
    if (!description) return null;

    // Split by line breaks and filter out empty lines
    const lines = description.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Check if it's a bullet point (starts with -, *, •, or number.)
      const isBulletPoint =
        /^[-*•]/.test(trimmedLine) || /^\d+\./.test(trimmedLine);

      if (isBulletPoint) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-indigo-400 mt-1">•</span>
            <span>
              {trimmedLine.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
            </span>
          </div>
        );
      } else {
        return (
          <p key={index} className="mb-2">
            {trimmedLine}
          </p>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-300">
            Manage your goals and track your progress towards success.
          </p>
        </div>

        {/* Quick Stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-900 rounded-lg">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Total Goals</p>
                  <p className="text-2xl font-bold text-white">
                    {goals.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-900 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-white">
                    {goals.filter((goal) => goal.priority === "high").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-900 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Due This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      goals.filter((goal) => {
                        const daysRemaining = getDaysRemaining(goal.targetDate);
                        return daysRemaining <= 30 && daysRemaining > 0;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Goals</h2>
            <button
              onClick={() => setShowCreateGoal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Goal
            </button>
          </div>

          {/* Create Goal Form */}
          {showCreateGoal && (
            <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Create New Goal
              </h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    placeholder="What do you want to achieve?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    rows="4"
                    placeholder="Describe your goal in detail... 
• Use bullet points for lists
• Or write in paragraphs
• Each line will be formatted automatically"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Tip: Start lines with -, *, • or numbers for bullet points
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Date *
                    </label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) =>
                        setFormData({ ...formData, targetDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                      placeholder="e.g., Career, Health, Personal"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  >
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGoal(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal._id}
                onClick={() => handleGoalClick(goal._id)}
                className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    🎯 {goal.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      goal.priority
                    )}`}
                  >
                    {goal.priority}
                  </span>
                </div>

                {goal.description && (
                  <div className="text-gray-300 text-sm mb-4 max-h-20 overflow-hidden">
                    {formatDescription(goal.description)}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {goal.category && (
                    <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs">
                      {goal.category}
                    </span>
                  )}
                  <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-xs">
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    {getDaysRemaining(goal.targetDate) > 0 ? (
                      <span className="text-green-400 font-medium">
                        {getDaysRemaining(goal.targetDate)} days left
                      </span>
                    ) : (
                      <span className="text-red-400 font-medium">Overdue</span>
                    )}
                  </div>
                  <div className="text-indigo-400 text-sm font-medium">
                    Click to manage →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 max-w-md mx-auto border border-gray-700">
              <div className="text-gray-500 mb-6">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Ready to achieve something great?
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Create your first goal and start breaking it down into
                manageable tasks.
              </p>
              <button
                onClick={() => setShowCreateGoal(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 font-medium text-lg transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalsPage;
