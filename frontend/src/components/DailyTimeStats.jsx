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
        `${import.meta.env.VITE_API_URL}/api/timelogs/daily/${goalId}?days=${days}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setDailyStats(data.dailyStats);

        const today = new Date();
        const todayStr = today.toDateString();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

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
      <div className="card p-3 w-64"> {/* Use .card */}
        <div className="text-[var(--ctp-subtext0)] text-sm">Loading stats...</div>
      </div>
    );
  }

  return (
    <>
      <div className="card p-4 w-72 shadow-lg"> {/* Use .card */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[var(--ctp-text)] flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-[var(--ctp-green)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Time Tracked
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-[var(--ctp-peach)] hover:text-[var(--ctp-flamingo)] flex items-center"
          >
            View All
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
        </div>

        {error ? (
          <div className="text-[var(--ctp-red)] text-sm">{error}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--ctp-subtext0)] text-sm">Today:</span>
              <span className="text-[var(--ctp-text)] font-medium text-sm">
                {formatDuration(totalMinutesToday)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--ctp-subtext0)] text-sm">This Week:</span>
              <span className="text-[var(--ctp-text)] font-medium text-sm">
                {formatDuration(totalMinutesThisWeek)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[var(--ctp-surface1)]">
              <span className="text-[var(--ctp-subtext0)] text-sm">Total Days:</span>
              <span className="text-[var(--ctp-peach)] font-medium text-sm">
                {dailyStats.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[var(--ctp-base)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"> {/* Use .card */}
            <div className="bg-[var(--ctp-crust)] px-6 py-4 border-b border-[var(--ctp-surface1)] flex justify-between items-center rounded-t-lg">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-[var(--ctp-text)]">
                  Daily Time Logs - {goalTitle}
                </h3>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="input-field px-3 py-1 text-sm"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] p-2 rounded-full hover:bg-[var(--ctp-surface0)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {error && (
                <div className="p-4 bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 text-[var(--ctp-red)] rounded-lg mb-6">
                  {error}
                </div>
              )}

              {dailyStats.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[var(--ctp-surface0)] rounded-lg p-4 border border-[var(--ctp-surface1)]">
                      <h4 className="text-sm text-[var(--ctp-subtext0)] mb-1">Today</h4>
                      <div className="text-xl font-semibold text-[var(--ctp-text)]">
                        {formatDuration(totalMinutesToday)}
                      </div>
                    </div>
                    <div className="bg-[var(--ctp-surface0)] rounded-lg p-4 border border-[var(--ctp-surface1)]">
                      <h4 className="text-sm text-[var(--ctp-subtext0)] mb-1">This Week</h4>
                      <div className="text-xl font-semibold text-[var(--ctp-text)]">
                        {formatDuration(totalMinutesThisWeek)}
                      </div>
                    </div>
                    <div className="bg-[var(--ctp-surface0)] rounded-lg p-4 border border-[var(--ctp-surface1)]">
                      <h4 className="text-sm text-[var(--ctp-subtext0)] mb-1">Total Days Tracked</h4>
                      <div className="text-xl font-semibold text-[var(--ctp-peach)]">
                        {dailyStats.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dailyStats.map((stat, index) => (
                      <div key={index} className="bg-[var(--ctp-surface0)] rounded-lg p-4 border border-[var(--ctp-surface1)]">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-[var(--ctp-text)] font-medium">
                              {new Date(stat.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric"})}
                            </h4>
                            <p className="text-[var(--ctp-subtext1)] text-sm">
                              {stat.totalSessions} session{stat.totalSessions !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-[var(--ctp-text)]">
                              {formatDuration(stat.totalMinutes)}
                            </div>
                            <div className="text-sm text-[var(--ctp-subtext1)]">
                              {stat.totalHours.toFixed(1)} hours
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stat.categoryBreakdown).map(([category, minutes]) => (
                              <span key={category} className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(category)}`}>
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
                  <div className="text-[var(--ctp-overlay0)] mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-[var(--ctp-subtext0)] text-lg font-medium mb-2">No Time Logged Yet</h3>
                  <p className="text-[var(--ctp-overlay1)]">Start tracking time on this goal to see daily statistics.</p>
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
