import React, { useState, useEffect, useRef } from "react";

const TimeTracker = ({
  goalId,
  taskListId = null,
  taskId = null,
  onTimeLogged,
  onClose,
  isOpen,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("execution");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState({
    hours: 0,
    minutes: 0,
  });
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, elapsed]);

  // Clean up timer when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);
    if (elapsed > 0) {
      // Always send at least 1 minute if timer was running
      const durationMinutes = Math.max(1, Math.floor(elapsed / 60));
      await logTime(durationMinutes, true);
      setElapsed(0);
      setDescription("");
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    clearInterval(intervalRef.current);
  };

  const logTime = async (durationMinutes, isTimerSession = false) => {
    try {
      const token = localStorage.getItem("token");

      // Build the request payload with correct field names
      const timeLogData = {
        goalId, // Backend expects 'goalId'
        duration: durationMinutes, // Duration in minutes (always >= 1)
        description: description || "",
        category,
        isTimerSession,
      };

      // Add optional fields with correct names
      if (taskListId) timeLogData.taskListId = taskListId;
      if (taskId) timeLogData.taskId = taskId;

      // For timer sessions, include start and end times
      if (isTimerSession && startTimeRef.current) {
        timeLogData.startTime = new Date(startTimeRef.current).toISOString();
        timeLogData.endTime = new Date().toISOString();
      }

      console.log("Sending time log data:", timeLogData); // Debug log

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timelogs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(timeLogData),
        }
      );

      if (response.ok) {
        const timeLog = await response.json();
        onTimeLogged?.(timeLog);

        // Show success message
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        // Use a better notification instead of alert
        console.log(`Time logged successfully: ${timeText}`);

        // Reset form after successful logging
        setDescription("");
        setCategory("execution");

        // Close modal after successful timer session
        if (isTimerSession) {
          setTimeout(() => onClose?.(), 1000);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server response:", errorData);
        throw new Error(errorData.message || "Failed to log time");
      }
    } catch (error) {
      console.error("Error logging time:", error);
      alert(`Failed to log time: ${error.message}`);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const totalMinutes = manualDuration.hours * 60 + manualDuration.minutes;
    if (totalMinutes > 0) {
      await logTime(totalMinutes, false);
      setManualDuration({ hours: 0, minutes: 0 });
      setShowManualEntry(false);
      setDescription("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gray-750 px-6 py-4 border-b border-gray-700 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Time Tracker
          </h3>
          <button
            onClick={onClose}
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
        <div className="p-6">
          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className="text-4xl font-mono text-white mb-4">
              {formatTime(elapsed)}
            </div>

            {/* Show minimum time notice */}
            {elapsed > 0 && elapsed < 60 && (
              <div className="text-sm text-yellow-300 mb-2">
                ⚠️ Minimum 1 minute will be logged
              </div>
            )}

            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pause
                </button>
              )}

              <button
                onClick={handleStop}
                disabled={elapsed === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-600 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Stop & Log
              </button>

              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Description and Category */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                What are you working on?
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your work..."
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="execution">Execution</option>
                <option value="planning">Planning</option>
                <option value="research">Research</option>
                <option value="review">Review</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Manual Entry Toggle */}
          <div className="border-t border-gray-700 pt-4">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="text-indigo-400 text-sm hover:text-indigo-300 mb-3"
            >
              {showManualEntry ? "Hide" : "Add"} manual time entry
            </button>

            {showManualEntry && (
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={manualDuration.hours}
                      onChange={(e) =>
                        setManualDuration((prev) => ({
                          ...prev,
                          hours: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={manualDuration.minutes}
                      onChange={(e) =>
                        setManualDuration((prev) => ({
                          ...prev,
                          minutes: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={
                    manualDuration.hours === 0 && manualDuration.minutes === 0
                  }
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-600 transition-colors"
                >
                  Log Manual Time
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
