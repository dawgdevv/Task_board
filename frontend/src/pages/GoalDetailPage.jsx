import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import ProfileIcon from "../components/ProfileIcon";
import EditGoalModal from "../components/EditGoalModal";

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
  const [showTaskListModal, setShowTaskListModal] = useState(false);
  const [selectedTaskListForModal, setSelectedTaskListForModal] =
    useState(null);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const scrollerRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollerRef.current) {
      // Only scroll horizontally if there's a horizontal scrollbar
      if (
        e.deltaY !== 0 &&
        scrollerRef.current.scrollWidth > scrollerRef.current.clientWidth
      ) {
        e.preventDefault();
        scrollerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Format description function
  const formatDescription = (description) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();
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
        setSelectedListIndex(taskLists.length);
      }
    } catch (error) {
      console.error("Error creating task list:", error);
      setError("Failed to create task list");
    }
  };

  const handleListSelect = (index) => {
    setSelectedListIndex(index);
  };

  const handleOpenTaskListModal = (taskList) => {
    setSelectedTaskListForModal(taskList);
    setShowTaskListModal(true);
  };

  const handleCloseTaskListModal = () => {
    setShowTaskListModal(false);
    setSelectedTaskListForModal(null);
  };

  const handleListDelete = async (deletedListId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists/${deletedListId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Update selectedListIndex after deletion
        const deletedIndex = taskLists.findIndex(
          (list) => list._id === deletedListId
        );

        if (deletedIndex === selectedListIndex) {
          setSelectedListIndex(taskLists.length > 1 ? 0 : -1);
        } else if (deletedIndex < selectedListIndex) {
          setSelectedListIndex(selectedListIndex - 1);
        }

        // Close modal if the deleted list was open in modal
        if (
          selectedTaskListForModal &&
          selectedTaskListForModal._id === deletedListId
        ) {
          handleCloseTaskListModal();
        }

        fetchGoalData();
      }
    } catch (error) {
      console.error("Error deleting task list:", error);
      setError("Failed to delete task list");
    }
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
                onClick={() => navigate("/goals")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Goals Dashboard
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
            <div className="text-right ml-6 flex flex-col items-end gap-2">
              <button
                onClick={() => setShowEditGoal(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors mb-2"
              >
                Edit Goal
              </button>
              <div>
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

        {/* Action Plans Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
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

          {/* Horizontal Task List Scroller */}
          {taskLists.length > 0 ? (
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="text-lg font-medium text-white">
                  Select Action Plan:
                </h3>
                <span className="text-sm text-gray-400">
                  ({taskLists.length} action plan
                  {taskLists.length !== 1 ? "s" : ""})
                </span>
              </div>

              <div className="relative">
                <div
                  ref={scrollerRef}
                  onWheel={handleWheel}
                  style={{ scrollBehavior: "smooth" }}
                  className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                >
                  {taskLists.map((list, index) => (
                    <div
                      key={list._id}
                      className={`flex-shrink-0 w-72 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        selectedListIndex === index
                          ? "border-indigo-500 bg-indigo-900/20 shadow-lg"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750"
                      }`}
                      onClick={() => handleListSelect(index)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-white truncate pr-2">
                          {list.name}
                        </h4>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">
                        Created: {new Date(list.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {selectedListIndex === index && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-600 text-white">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                💡 Scroll horizontally to view all action plans. Click to select
                and view tasks below.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-gray-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
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
          )}
        </div>

        {/* Task Management Section - NEW FEATURE */}
        {selectedListIndex >= 0 && taskLists[selectedListIndex] && (
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="bg-gray-750 px-6 py-4 border-b border-gray-700 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white">
                      📋 {taskLists[selectedListIndex].name}
                    </h3>
                    <span className="bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full text-sm">
                      Tasks & Progress
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleOpenTaskListModal(taskLists[selectedListIndex])
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center text-sm"
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open Full View
                  </button>
                </div>
              </div>

              <div className="p-6">
                <TaskBoard
                  key={taskLists[selectedListIndex]._id}
                  taskList={taskLists[selectedListIndex]}
                  onUpdate={fetchGoalData}
                  onDelete={handleListDelete}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Task List Modal */}
      {showTaskListModal && selectedTaskListForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-600 w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">
                  {selectedTaskListForModal.name}
                </h3>
                <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs">
                  Part of: {goal.title}
                </span>
              </div>
              <button
                onClick={handleCloseTaskListModal}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <TaskBoard
                key={selectedTaskListForModal._id}
                taskList={selectedTaskListForModal}
                onUpdate={() => {
                  fetchGoalData();
                  // Keep modal open after updates
                }}
                onDelete={(deletedListId) => {
                  handleListDelete(deletedListId);
                  // Modal will be closed by handleListDelete if this list was deleted
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-800 px-6 py-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={handleCloseTaskListModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditGoal && (
        <EditGoalModal
          goal={goal}
          onClose={() => setShowEditGoal(false)}
          onUpdated={async () => {
            await fetchGoalData();
            setShowEditGoal(false);
          }}
        />
      )}
    </div>
  );
};

export default GoalDetailPage;
