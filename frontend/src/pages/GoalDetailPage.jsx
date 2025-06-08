import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import Taskslider from "../components/Taskslider";
import ProfileIcon from "../components/ProfileIcon";

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(-1);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            <span className="text-indigo-400 mt-1 text-sm">•</span>
            <span className="text-sm">
              {trimmedLine.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
            </span>
          </div>
        );
      } else {
        return (
          <p key={index} className="mb-2 text-sm">
            {trimmedLine}
          </p>
        );
      }
    });
  };

  const fetchGoalData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGoal(data.goal);
        setTaskLists(data.taskLists);
        if (data.taskLists.length > 0 && selectedListIndex === -1) {
          setSelectedListIndex(0);
        } else if (data.taskLists.length === 0) {
          setSelectedListIndex(-1);
        }
      } else {
        throw new Error("Failed to fetch goal data");
      }
    } catch (error) {
      console.error("Error fetching goal data:", error);
      setError("Failed to load goal data");
    } finally {
      setLoading(false);
    }
  }, [goalId, navigate, selectedListIndex]);

  useEffect(() => {
    fetchGoalData();
  }, [fetchGoalData]);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newListName,
            goalId: goalId,
          }),
        }
      );

      if (response.ok) {
        await fetchGoalData();
        setNewListName("");
        setShowCreateList(false);
        setSelectedListIndex(taskLists.length); // Select the new list
      }
    } catch (error) {
      console.error("Error creating task list:", error);
      setError("Failed to create task list");
    }
  };

  const handleListSelect = (index) => {
    setSelectedListIndex(index);
  };

  const handleListDelete = (deletedListId) => {
    // Adjust selected index if necessary
    const deletedIndex = taskLists.findIndex(
      (list) => list._id === deletedListId
    );
    if (deletedIndex === selectedListIndex) {
      setSelectedListIndex(taskLists.length > 1 ? 0 : -1);
    } else if (deletedIndex < selectedListIndex) {
      setSelectedListIndex(selectedListIndex - 1);
    }

    fetchGoalData();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading goal...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error || "Goal not found"}</p>
            <button
              onClick={() => navigate("/goals")}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Back to Goals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(goal.targetDate);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/goals")}
                className="text-indigo-400 hover:text-indigo-300"
              >
                ← Back to Goals
              </button>
              <h1 className="text-2xl font-bold text-white">Goal Progress</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileIcon />
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {goal.title}
              </h2>
              {goal.description && (
                <div className="text-gray-300 mb-3">
                  {formatDescription(goal.description)}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {goal.category && (
                  <span className="bg-blue-800 text-blue-200 px-3 py-1 rounded-full text-sm">
                    {goal.category}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    goal.priority
                  )}`}
                >
                  {goal.priority.charAt(0).toUpperCase() +
                    goal.priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
            </div>
            <div className="text-right ml-6">
              <div className="text-sm text-gray-400 mb-1">Target Date</div>
              <div className="font-semibold text-white">
                {formatDate(goal.targetDate)}
              </div>
              <div
                className={`text-sm mt-1 ${
                  daysRemaining < 0
                    ? "text-red-400"
                    : daysRemaining < 30
                    ? "text-orange-400"
                    : "text-green-400"
                }`}
              >
                {daysRemaining < 0
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : daysRemaining === 0
                  ? "Due today"
                  : `${daysRemaining} days remaining`}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, 100 - (daysRemaining / 365) * 100)
                )}%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-400">
            Progress towards your goal
          </div>
        </div>

        {/* Task Lists Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Action Plans for "{goal.title}"
            </h2>
            <button
              onClick={() => setShowCreateList(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <span className="text-xl mr-2">+</span>
              Add Action Plan
            </button>
          </div>

          {showCreateList && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter action plan name (e.g., 'Weekly Milestones', 'Learning Path')"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
                />
                <button
                  onClick={handleCreateList}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateList(false);
                    setNewListName("");
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Task List Slider */}
        <Taskslider
          taskLists={taskLists}
          selectedListIndex={selectedListIndex}
          onListSelect={handleListSelect}
          onListDelete={handleListDelete}
        />

        {/* Selected Task Board Display */}
        {taskLists.length > 0 && selectedListIndex >= 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <TaskBoard
              key={taskLists[selectedListIndex]?._id}
              taskList={taskLists[selectedListIndex]}
              onUpdate={fetchGoalData}
              onDelete={handleListDelete}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
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
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-300 text-lg">
                No action plans yet. Create your first action plan to break down
                "{goal.title}" into manageable tasks!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalDetailPage;
