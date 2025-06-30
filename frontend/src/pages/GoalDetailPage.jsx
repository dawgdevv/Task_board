import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
// ProfileIcon might not be used directly, Navbar handles user display
import EditGoalModal from "../components/EditGoalModal";
import TimeTracker from "../components/TimeTracker";

const ActionPlanCard = React.memo(
  ({ list, index, isSelected, onSelectList }) => {
    return (
      <div
        className={`flex-shrink-0 w-72 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-[var(--ctp-peach)] bg-[var(--ctp-peach)]/10 shadow-lg"
            : "border-[var(--ctp-surface1)] bg-[var(--ctp-mantle)] hover:border-[var(--ctp-surface2)] hover:bg-[var(--ctp-surface0)]"
        }`}
        onClick={() => onSelectList(index)}
      >
        <h4 className="text-lg font-semibold text-[var(--ctp-text)] truncate pr-2 mb-3">
          {list.name}
        </h4>
        <p className="text-[var(--ctp-subtext1)] text-sm mb-3">
          Created: {new Date(list.createdAt).toLocaleDateString()}
        </p>
        {isSelected && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[var(--ctp-peach)] text-[var(--ctp-base)]">
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
    );
  }
);
ActionPlanCard.displayName = "ActionPlanCard";
import DailyTimeStats from "../components/DailyTimeStats";

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
  const [user, setUser] = useState(null);
  const [showTaskListModal, setShowTaskListModal] = useState(false);
  const [selectedTaskListForModal, setSelectedTaskListForModal] =
    useState(null);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const scrollerRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollerRef.current) {
      if (
        e.deltaY !== 0 &&
        scrollerRef.current.scrollWidth > scrollerRef.current.clientWidth
      ) {
        e.preventDefault();
        scrollerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

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
            <span className="text-[var(--ctp-peach)] mt-1 text-sm">•</span>
            <span className="text-sm text-[var(--ctp-subtext1)]">
              {trimmedLine.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
            </span>
          </div>
        );
      } else {
        return (
          <p key={index} className="mb-2 text-sm text-[var(--ctp-subtext1)]">
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(localStorage.getItem("user"));
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setError("Failed to load user data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleCreateList = useCallback(async () => {
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
          body: JSON.stringify({ name: newListName, goalId: goalId }),
        }
      );
      if (response.ok) {
        await fetchGoalData(); // Already memoized
        setNewListName("");
        setShowCreateList(false);
        // This part might cause an issue if taskLists isn't updated yet from fetchGoalData
        // Consider updating selectedListIndex based on the response from creating list or after fetchGoalData confirms update
        // For now, let's assume fetchGoalData updates taskLists correctly before this line effectively runs.
        setSelectedListIndex(taskLists.length);
      }
    } catch (error) {
      console.error("Error creating task list:", error);
      setError("Failed to create task list");
    }
  }, [newListName, goalId, fetchGoalData, taskLists.length]);

  const handleLogout = () => {
    // Not performance critical for re-renders, but fine to keep as is or memoize if desired
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleListSelect = useCallback(
    (index) => setSelectedListIndex(index),
    []
  );

  const handleOpenTaskListModal = useCallback((taskList) => {
    setSelectedTaskListForModal(taskList);
    setShowTaskListModal(true);
  }, []);

  const handleCloseTaskListModal = useCallback(() => {
    setShowTaskListModal(false);
    setSelectedTaskListForModal(null);
  }, []);

  const handleListDelete = useCallback(
    async (deletedListId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/lists/${deletedListId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const deletedIndex = taskLists.findIndex(
            (list) => list._id === deletedListId
          );
          if (deletedIndex === selectedListIndex) {
            setSelectedListIndex(taskLists.length > 1 ? 0 : -1);
          } else if (deletedIndex < selectedListIndex) {
            setSelectedListIndex(selectedListIndex - 1);
          }
          if (
            selectedTaskListForModal &&
            selectedTaskListForModal._id === deletedListId
          ) {
            handleCloseTaskListModal(); // Already memoized
          }
          fetchGoalData(); // Already memoized
        }
      } catch (error) {
        console.error("Error deleting task list:", error);
        setError("Failed to delete task list");
      }
    },
    [
      taskLists,
      selectedListIndex,
      selectedTaskListForModal,
      fetchGoalData,
      handleCloseTaskListModal,
    ]
  );

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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleTimeLogged = (timeLog) => {
    fetchGoalData();
    console.log("Time logged successfully:", timeLog);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--ctp-peach)] mx-auto"></div>
          <p className="mt-4 text-[var(--ctp-subtext0)]">Loading goal...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 text-[var(--ctp-red)] px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error || "Goal not found"}</p>
            <button
              onClick={() => navigate("/goals")}
              className="button-danger mt-3 px-4 py-2"
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
    <div className="min-h-screen">
      {" "}
      {/* bg-gray-900 removed */}
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6 mb-8">
          {" "}
          {/* Use .card class */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[var(--ctp-text)] mb-2">
                {goal.title}
              </h2>
              {goal.description && (
                <div className="text-2xl text-[var(--ctp-subtext1)] mb-3">
                  {formatDescription(goal.description)}
                </div>
              )}
              <div className="flex flex-wrap gap-3 items-center">
                {goal.category && (
                  <span className="bg-[var(--ctp-sky)]/30 text-[var(--ctp-sky)] px-3 py-1 rounded-full text-sm">
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    daysRemaining >= 0
                      ? "bg-[var(--ctp-green)]/30 text-[var(--ctp-green)]"
                      : "bg-[var(--ctp-red)]/30 text-[var(--ctp-red)]"
                  }`}
                >
                  {daysRemaining >= 0
                    ? `Days Remaining: ${daysRemaining}`
                    : `Target Passed: ${Math.abs(daysRemaining)} days ago`}
                </span>
              </div>
            </div>

            <div className="ml-6 flex gap-4">
              <DailyTimeStats goalId={goalId} goalTitle={goal?.title} />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowEditGoal(true)}
                  className="button-base bg-[var(--ctp-yellow)] text-[var(--ctp-base)] px-4 py-2 flex items-center whitespace-nowrap hover:opacity-80"
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
                      d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Goal
                </button>
                <button
                  onClick={() => setShowTimeTracker(true)}
                  className="button-base bg-[var(--ctp-green)] text-[var(--ctp-base)] px-4 py-2 flex items-center whitespace-nowrap hover:opacity-80"
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Track Time
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--ctp-text)]">
              Action Plans for The current Goal"
            </h2>
            <button
              onClick={() => setShowCreateList(true)}
              className="button-primary flex items-center px-4 py-2"
            >
              <span className="text-xl mr-2">+</span>
              Add Action Plan
            </button>
          </div>

          {showCreateList && (
            <div className="card mb-4 p-4">
              {" "}
              {/* Use .card */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter action plan name (e.g., 'Weekly Milestones', 'Learning Path')"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input-field flex-1 placeholder-[var(--ctp-overlay0)]"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
                />
                <button
                  onClick={handleCreateList}
                  className="button-base bg-[var(--ctp-green)] text-[var(--ctp-base)] px-4 py-2 hover:opacity-80"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateList(false);
                    setNewListName("");
                  }}
                  className="button-secondary px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {taskLists.length > 0 ? (
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="text-lg font-medium text-[var(--ctp-text)]">
                  Select Action Plan:
                </h3>
                <span className="text-sm text-[var(--ctp-subtext0)]">
                  ({taskLists.length} action plan
                  {taskLists.length !== 1 ? "s" : ""})
                </span>
              </div>
              <div className="relative">
                <div
                  ref={scrollerRef}
                  onWheel={handleWheel}
                  style={{ scrollBehavior: "smooth" }}
                  className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-[var(--ctp-crust)] scrollbar-thumb-[var(--ctp-surface1)] hover:scrollbar-thumb-[var(--ctp-surface2)]"
                >
                  {taskLists.map((list, index) => (
                    <ActionPlanCard
                      key={list._id}
                      list={list}
                      index={index}
                      isSelected={selectedListIndex === index}
                      onSelectList={handleListSelect}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--ctp-overlay0)] mt-2">
                💡 Scroll horizontally to view all action plans. Click to select
                and view tasks below.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 card">
              {" "}
              {/* Use .card */}
              <div className="text-[var(--ctp-overlay0)] mb-4">
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
              <p className="text-[var(--ctp-subtext0)] text-lg">
                No action plans yet. Create your first action plan to break down
                "{goal.title}" into manageable tasks!
              </p>
            </div>
          )}
        </div>

        {selectedListIndex >= 0 && taskLists[selectedListIndex] && (
          <div className="mb-8">
            <div className="card shadow-lg">
              {" "}
              {/* Use .card */}
              <div className="bg-[var(--ctp-crust)] px-6 py-4 border-b border-[var(--ctp-surface1)] rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-[var(--ctp-text)]">
                      📋 {taskLists[selectedListIndex].name}
                    </h3>
                    <span className="bg-[var(--ctp-peach)]/30 text-[var(--ctp-peach)] px-3 py-1 rounded-full text-sm">
                      Tasks & Progress
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleOpenTaskListModal(taskLists[selectedListIndex])
                    }
                    className="button-primary flex items-center text-sm px-4 py-2"
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
      {showTaskListModal && selectedTaskListForModal && (
        <div className="fixed inset-0 bg-[var(--ctp-base)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--ctp-mantle)] rounded-lg shadow-2xl border border-[var(--ctp-surface1)] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[var(--ctp-crust)] px-6 py-4 border-b border-[var(--ctp-surface1)] flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-[var(--ctp-text)]">
                  {selectedTaskListForModal.name}
                </h3>
                <span className="bg-[var(--ctp-sky)]/30 text-[var(--ctp-sky)] px-2 py-1 rounded-full text-xs">
                  Part of: {goal.title}
                </span>
              </div>
              <button
                onClick={handleCloseTaskListModal}
                className="text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] p-2 rounded-full hover:bg-[var(--ctp-surface0)] transition-colors"
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
            <div className="p-6 overflow-y-auto flex-grow">
              <TaskBoard
                key={selectedTaskListForModal._id}
                taskList={selectedTaskListForModal}
                onUpdate={fetchGoalData}
                onDelete={handleListDelete}
              />
            </div>
            <div className="bg-[var(--ctp-crust)] px-6 py-3 border-t border-[var(--ctp-surface1)] flex justify-end">
              <button
                onClick={handleCloseTaskListModal}
                className="button-secondary px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
      <TimeTracker
        goalId={goalId}
        taskListId={
          selectedListIndex >= 0 ? taskLists[selectedListIndex]?._id : null
        }
        onTimeLogged={handleTimeLogged}
        onClose={() => setShowTimeTracker(false)}
        isOpen={showTimeTracker}
      />
    </div>
  );
};

export default GoalDetailPage;
