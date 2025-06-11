import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TimeLogsPage = () => {
  const [user, setUser] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    goalId: "",
    startDate: "",
    endDate: "",
    page: 1,
  });
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const fetchTimeLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timelogs?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTimeLogs(data.timeLogs);
      } else {
        setError("Failed to fetch time logs");
      }
    } catch (error) {
      console.error("Error fetching time logs:", error);
      setError("Failed to fetch time logs");
    } finally {
      setLoading(false);
    }
  }, [filters]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchTimeLogs();
    fetchGoals();
    fetchStats();
  }, [navigate, filters, fetchTimeLogs]);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const goalsData = await response.json();
        setGoals(goalsData);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timelogs/stats?period=week`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      execution: "bg-blue-600",
      planning: "bg-purple-600",
      research: "bg-green-600",
      review: "bg-yellow-600",
      meeting: "bg-red-600",
      other: "bg-gray-600",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading time logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Time Tracking 📊
          </h1>
          <p className="text-gray-300">
            Track and analyze your time spent on goals and tasks.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.goal?.[0]?.title || "All Goals"}
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Total Time:</span>
                    <span className="text-white font-semibold ml-2">
                      {formatDuration(stat.totalMinutes)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sessions:</span>
                    <span className="text-white font-semibold ml-2">
                      {stat.totalSessions}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Avg Session:</span>
                    <span className="text-white font-semibold ml-2">
                      {formatDuration(Math.round(stat.avgSessionLength))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Goal
              </label>
              <select
                value={filters.goalId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    goalId: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                <option value="">All Goals</option>
                {goals.map((goal) => (
                  <option key={goal._id} value={goal._id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    goalId: "",
                    startDate: "",
                    endDate: "",
                    page: 1,
                  })
                }
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Time Logs List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Recent Time Logs
            </h3>
          </div>

          {error && (
            <div className="p-6 bg-red-900 border-b border-gray-700 text-red-200">
              {error}
            </div>
          )}

          <div className="divide-y divide-gray-700">
            {timeLogs.length > 0 ? (
              timeLogs.map((log) => (
                <div key={log._id} className="p-6 hover:bg-gray-750">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-medium">
                          {log.goal?.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs text-white ${getCategoryColor(
                            log.category
                          )}`}
                        >
                          {log.category}
                        </span>
                        {log.isTimerSession && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-600 text-white">
                            Timer
                          </span>
                        )}
                      </div>

                      {log.taskList && (
                        <p className="text-sm text-gray-400 mb-1">
                          List: {log.taskList.name}
                        </p>
                      )}

                      {log.task && (
                        <p className="text-sm text-gray-400 mb-1">
                          Task: {log.task.title}
                        </p>
                      )}

                      {log.description && (
                        <p className="text-gray-300 text-sm mb-2">
                          {log.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          {new Date(log.createdAt).toLocaleDateString()} at{" "}
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                        <span>
                          {new Date(log.startTime).toLocaleTimeString()} -{" "}
                          {new Date(log.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        {formatDuration(log.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-400 text-lg font-medium mb-2">
                  No Time Logs Found
                </h3>
                <p className="text-gray-500">
                  Start tracking time on your goals to see logs here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeLogsPage;
