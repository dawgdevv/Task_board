import React, { useState, useEffect, useCallback } from "react";

const DailyTimeStats = ({ goalId, goalTitle }) => {
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const [totalMinutesThisWeek, setTotalMinutesThisWeek] = useState(0);

  const fetchDailyStats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/timelogs/daily/${goalId}?days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDailyStats(data.dailyStats);

        // Calculate today's and this week's totals
        const today = new Date();
        const todayStr = today.toDateString();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

        let todayTotal = 0;
        let weekTotal = 0;

        data.dailyStats.forEach((stat) => {
          const statDate = new Date(stat.date);
          if (statDate.toDateString() === todayStr) {
            todayTotal = stat.totalMinutes;
          }
          if (statDate >= weekStart) {
            weekTotal += stat.totalMinutes;
          }
        });

        setTotalMinutesToday(todayTotal);
        setTotalMinutesThisWeek(weekTotal);
      } else {
        setError("Failed to fetch daily stats");
      }
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      setError("Failed to fetch daily stats");
    } finally {
      setLoading(false);
    }
  }, [goalId, days]);

  useEffect(() => {
    if (goalId) {
      fetchDailyStats();
    }
  }, [goalId, days, fetchDailyStats]);

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
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-64">
        <div className="text-white text-sm">Loading stats...</div>
      </div>
    );
  }

  return (
    <>
      {/* Compact Display */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-72 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-400"
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
            Time Tracked
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            View All
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>

        {error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Today:</span>
              <span className="text-white font-medium text-sm">
                {formatDuration(totalMinutesToday)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">This Week:</span>
              <span className="text-white font-medium text-sm">
                {formatDuration(totalMinutesThisWeek)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-700">
              <span className="text-gray-300 text-sm">Total Days:</span>
              <span className="text-indigo-400 font-medium text-sm">
                {dailyStats.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-white">
                  Daily Time Logs - {goalTitle}
                </h3>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white text-sm"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {error && (
                <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {dailyStats.length > 0 ? (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-sm text-gray-300 mb-1">Today</h4>
                      <div className="text-xl font-semibold text-white">
                        {formatDuration(totalMinutesToday)}
                      </div>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-sm text-gray-300 mb-1">This Week</h4>
                      <div className="text-xl font-semibold text-white">
                        {formatDuration(totalMinutesThisWeek)}
                      </div>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-sm text-gray-300 mb-1">
                        Total Days Tracked
                      </h4>
                      <div className="text-xl font-semibold text-indigo-400">
                        {dailyStats.length}
                      </div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="space-y-3">
                    {dailyStats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gray-750 rounded-lg p-4 border border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">
                              {new Date(stat.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {stat.totalSessions} session
                              {stat.totalSessions !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-white">
                              {formatDuration(stat.totalMinutes)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {stat.totalHours.toFixed(1)} hours
                            </div>
                          </div>
                        </div>

                        {/* Category breakdown */}
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stat.categoryBreakdown).map(
                            ([category, minutes]) => (
                              <span
                                key={category}
                                className={`px-2 py-1 rounded-full text-xs text-white ${getCategoryColor(
                                  category
                                )}`}
                              >
                                {category}: {formatDuration(minutes)}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
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
                    No Time Logged Yet
                  </h3>
                  <p className="text-gray-500">
                    Start tracking time on this goal to see daily statistics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyTimeStats;
