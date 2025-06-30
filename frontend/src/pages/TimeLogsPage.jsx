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

  const fetchGoals = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timelogs/stats?period=week`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) setStats(await response.json());
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchTimeLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
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
        setTimeLogs(data.timeLogs || []);
      } else {
        throw new Error("Failed to fetch time logs");
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
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
      return;
    }
    fetchTimeLogs();
    fetchGoals();
    fetchStats();
  }, [navigate, fetchTimeLogs, fetchGoals, fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      execution: "bg-[var(--ctp-blue)]/80 text-[var(--ctp-text)]",
      planning: "bg-[var(--ctp-mauve)]/80 text-[var(--ctp-text)]",
      research: "bg-[var(--ctp-green)]/80 text-[var(--ctp-base)]",
      review: "bg-[var(--ctp-yellow)]/80 text-[var(--ctp-base)]",
      meeting: "bg-[var(--ctp-red)]/80 text-[var(--ctp-base)]",
      other: "bg-[var(--ctp-surface1)] text-[var(--ctp-subtext0)]",
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {" "}
        {/* bg-gray-900 removed */}
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ctp-peach)] mx-auto mb-4"></div>{" "}
            {/* Themed spinner */}
            <p className="text-[var(--ctp-subtext0)]">Loading time logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {" "}
      {/* bg-gray-900 removed */}
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ctp-text)] mb-2">
            Time Tracking 📊
          </h1>
          <p className="text-[var(--ctp-subtext0)]">
            Track and analyze your time spent on goals and tasks.
          </p>
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card p-6">
                {" "}
                {/* Use .card */}
                <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-2">
                  {stat.goal?.[0]?.title || "All Goals"}
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-[var(--ctp-subtext1)]">
                      Total Time:
                    </span>
                    <span className="text-[var(--ctp-text)] font-semibold ml-2">
                      {formatDuration(stat.totalMinutes)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--ctp-subtext1)]">
                      Sessions:
                    </span>
                    <span className="text-[var(--ctp-text)] font-semibold ml-2">
                      {stat.totalSessions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--ctp-subtext1)]">
                      Avg Session:
                    </span>
                    <span className="text-[var(--ctp-text)] font-semibold ml-2">
                      {formatDuration(Math.round(stat.avgSessionLength || 0))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card p-6 mb-8">
          {" "}
          {/* Use .card */}
          <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
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
                className="input-field w-full px-3 py-2"
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
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
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
                className="input-field w-full px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
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
                className="input-field w-full px-3 py-2"
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
                className="button-secondary w-full px-4 py-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 text-[var(--ctp-red)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="card">
          {" "}
          {/* Use .card */}
          <div className="px-6 py-4 border-b border-[var(--ctp-surface1)]">
            <h3 className="text-lg font-semibold text-[var(--ctp-text)]">
              Recent Time Logs ({timeLogs.length})
            </h3>
          </div>
          <div className="divide-y divide-[var(--ctp-surface1)]">
            {timeLogs.length > 0 ? (
              timeLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-6 hover:bg-[var(--ctp-surface0)] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[var(--ctp-text)] font-medium">
                          {log.goal?.title || "Unknown Goal"}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                            log.category
                          )}`}
                        >
                          {log.category}
                        </span>
                        {log.isTimerSession && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                              "research"
                            )} `}
                          >
                            {" "}
                            {/* Using research color for timer as an example */}
                            Timer
                          </span>
                        )}
                      </div>
                      {log.taskList && (
                        <p className="text-sm text-[var(--ctp-subtext1)] mb-1">
                          List: {log.taskList.name}
                        </p>
                      )}
                      {log.task && (
                        <p className="text-sm text-[var(--ctp-subtext1)] mb-1">
                          Task: {log.task.title}
                        </p>
                      )}
                      {log.description && (
                        <p className="text-[var(--ctp-subtext0)] text-sm mb-2">
                          {log.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-[var(--ctp-overlay1)]">
                        <span>
                          {new Date(log.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(log.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {log.startTime && log.endTime && (
                          <span>
                            {new Date(log.startTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            -{" "}
                            {new Date(log.endTime).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-[var(--ctp-text)]">
                        {formatDuration(log.duration)}
                      </div>
                      <div className="text-xs text-[var(--ctp-subtext1)]">
                        {(log.duration / 60).toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-[var(--ctp-overlay0)] mb-4">
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
                <h3 className="text-[var(--ctp-subtext0)] text-lg font-medium mb-2">
                  No Time Logs Found
                </h3>
                <p className="text-[var(--ctp-overlay1)] mb-4">
                  Start tracking time on your goals to see logs here.
                </p>
                <button
                  onClick={() => navigate("/goals")}
                  className="button-primary px-4 py-2"
                >
                  Go to Goals
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeLogsPage;
