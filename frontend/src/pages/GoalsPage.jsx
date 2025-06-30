import { useState, useEffect, useCallback } from "react";
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
  const [isCreatingGoal, setIsCreatingGoal] = useState(false); // New state for create goal button
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchGoals = useCallback(async () => {
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
  }, [navigate]);

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
  }, [navigate, fetchGoals]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateGoal = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsCreatingGoal(true); // Set loading state for button

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
        await fetchGoals(); // fetchGoals is already memoized
        setFormData({
          title: "",
          description: "",
          targetDate: "",
          priority: "medium",
          category: "",
        });
        setShowCreateGoal(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal. Please try again.");
    } finally {
      setIsCreatingGoal(false); // Reset loading state for button
    }
  }, [formData, fetchGoals]);

  const handleGoalClick = useCallback((goalId) => {
    navigate(`/goal/${goalId}`);
  }, [navigate]); // Added navigate dependency

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-[var(--ctp-red)]/30 text-[var(--ctp-red)]";
      case "medium":
        return "bg-[var(--ctp-yellow)]/30 text-[var(--ctp-yellow)]";
      case "low":
        return "bg-[var(--ctp-green)]/30 text-[var(--ctp-green)]";
      default:
        return "bg-[var(--ctp-surface1)] text-[var(--ctp-subtext0)]";
    }
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDescription = (description) => {
    if (!description) return null;
    const lines = description.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      const isBulletPoint = /^[-*•]/.test(trimmedLine) || /^\d+\./.test(trimmedLine);
      if (isBulletPoint) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-[var(--ctp-peach)] mt-1">•</span> {/* Themed bullet */}
            <span className="text-[var(--ctp-subtext1)]"> {/* Themed text */}
              {trimmedLine.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
            </span>
          </div>
        );
      } else {
        return (
          <p key={index} className="mb-2 text-[var(--ctp-subtext1)]"> {/* Themed text */}
            {trimmedLine}
          </p>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"> {/* bg-gray-900 removed */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--ctp-peach)] mx-auto"></div> {/* Themed spinner */}
          <p className="mt-4 text-[var(--ctp-subtext0)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"> {/* bg-gray-900 removed */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ctp-text)] mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-[var(--ctp-subtext0)]">
            Manage your goals and track your progress towards success.
          </p>
        </div>

        {/* Quick Stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6"> {/* Use .card class */}
              <div className="flex items-center">
                <div className="p-2 bg-[var(--ctp-surface0)] rounded-lg"> {/* Themed icon bg */}
                  <svg
                    className="w-6 h-6 text-[var(--ctp-peach)]" // Themed icon color
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
                  <p className="text-[var(--ctp-subtext1)] text-sm">Total Goals</p>
                  <p className="text-2xl font-bold text-[var(--ctp-text)]">
                    {goals.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6"> {/* Use .card class */}
              <div className="flex items-center">
                <div className="p-2 bg-[var(--ctp-surface0)] rounded-lg"> {/* Themed icon bg */}
                  <svg
                    className="w-6 h-6 text-[var(--ctp-red)]" // Themed icon color (High Prio)
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
                  <p className="text-[var(--ctp-subtext1)] text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-[var(--ctp-text)]">
                    {goals.filter((goal) => goal.priority === "high").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6"> {/* Use .card class */}
              <div className="flex items-center">
                <div className="p-2 bg-[var(--ctp-surface0)] rounded-lg"> {/* Themed icon bg */}
                  <svg
                    className="w-6 h-6 text-[var(--ctp-yellow)]" // Themed icon color (Due Soon)
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
                  <p className="text-[var(--ctp-subtext1)] text-sm">Due This Month</p>
                  <p className="text-2xl font-bold text-[var(--ctp-text)]">
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
            <h2 className="text-2xl font-bold text-[var(--ctp-text)]">Your Goals</h2>
            <button
              onClick={() => setShowCreateGoal(true)}
              className="button-primary flex items-center font-medium px-6 py-3" // Use .button-primary
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
            <div className="card mb-8 p-6"> {/* Use .card class */}
              <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">
                Create New Goal
              </h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]" // Use .input-field
                    placeholder="What do you want to achieve?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]" // Use .input-field
                    rows="4"
                    placeholder="Describe your goal in detail... 
• Use bullet points for lists
• Or write in paragraphs
• Each line will be formatted automatically"
                  />
                  <p className="text-xs text-[var(--ctp-overlay1)] mt-1"> {/* Themed tip text */}
                    Tip: Start lines with -, *, • or numbers for bullet points
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                      Target Date *
                    </label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) =>
                        setFormData({ ...formData, targetDate: e.target.value })
                      }
                      className="input-field w-full px-4 py-3" // Use .input-field
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="input-field w-full px-4 py-3" // Use .input-field
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]" // Use .input-field
                      placeholder="e.g., Career, Health, Personal"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="button-primary px-6 py-3 font-medium disabled:opacity-70" // Use .button-primary
                    disabled={isCreatingGoal}
                  >
                    {isCreatingGoal ? "Creating..." : "Create Goal"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGoal(false)}
                    className="button-secondary px-6 py-3 font-medium"
                    disabled={isCreatingGoal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 text-[var(--ctp-red)] px-4 py-3 rounded-lg mb-6"> {/* Themed error */}
            {error}
          </div>
        )}

import React, { useState, useEffect, useCallback } from "react"; // Import React if not already

// Helper function (already defined in the component, kept here for clarity if extracted)
const formatDescriptionForCard = (description) => {
  if (!description) return null;
  const lines = description.split("\n").filter((line) => line.trim() !== "");
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    const isBulletPoint = /^[-*•]/.test(trimmedLine) || /^\d+\./.test(trimmedLine);
    if (isBulletPoint) {
      return (
        <div key={index} className="flex items-start space-x-2 mb-1">
          <span className="text-[var(--ctp-peach)] mt-1">•</span>
          <span className="text-[var(--ctp-subtext1)]">
            {trimmedLine.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
          </span>
        </div>
      );
    } else {
      return (
        <p key={index} className="mb-2 text-[var(--ctp-subtext1)]">
          {trimmedLine}
        </p>
      );
    }
  });
};

const GoalCard = React.memo(({ goal, onGoalClick, getPriorityColor, getDaysRemaining }) => {
  return (
    <div
      onClick={() => onGoalClick(goal._id)}
      className="card p-6 cursor-pointer hover:bg-[var(--ctp-surface0)] transition-all duration-200 hover:border-[var(--ctp-surface2)] hover:shadow-xl transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-[var(--ctp-text)] mb-2 line-clamp-2">
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
        <div className="text-[var(--ctp-subtext1)] text-sm mb-4 max-h-20 overflow-hidden">
          {formatDescriptionForCard(goal.description)}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {goal.category && (
          <span className="bg-[var(--ctp-sky)]/30 text-[var(--ctp-sky)] px-2 py-1 rounded-full text-xs">
            {goal.category}
          </span>
        )}
        <span className="bg-[var(--ctp-surface1)] text-[var(--ctp-subtext0)] px-2 py-1 rounded-full text-xs">
          Due: {new Date(goal.targetDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          {getDaysRemaining(goal.targetDate) > 0 ? (
            <span className="text-[var(--ctp-green)] font-medium">
              {getDaysRemaining(goal.targetDate)} days left
            </span>
          ) : (
            <span className="text-[var(--ctp-red)] font-medium">Overdue</span>
          )}
        </div>
        <div className="text-[var(--ctp-peach)] text-sm font-medium">
          Click to manage →
        </div>
      </div>
    </div>
  );
});
GoalCard.displayName = 'GoalCard'; // For better debugging

// ... (rest of the GoalsPage component code above this) ...

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onGoalClick={handleGoalClick}
                getPriorityColor={getPriorityColor}
                getDaysRemaining={getDaysRemaining}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="card p-12 max-w-md mx-auto"> {/* Use .card class */}
              <div className="text-[var(--ctp-overlay0)] mb-6"> {/* Themed icon color */}
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
              <h3 className="text-xl font-bold text-[var(--ctp-text)] mb-4">
                Ready to achieve something great?
              </h3>
              <p className="text-[var(--ctp-subtext0)] text-lg mb-6">
                Create your first goal and start breaking it down into
                manageable tasks.
              </p>
              <button
                onClick={() => setShowCreateGoal(true)}
                className="button-primary px-8 py-4 font-medium text-lg" // Use .button-primary
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
