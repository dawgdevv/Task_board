import { useState, useEffect, useCallback } from "react";
import TaskModal from "./TaskModal";

const TaskBoard = ({ taskList, onUpdate, onDelete }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false); // New state for add task button
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="input-field flex-1 px-3 py-2 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              disabled={isAddingTask}
            > [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false); // New state for add task button

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/list/${taskList._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setTasks([]); // Clear tasks on error or if list not found
        console.error("Failed to fetch tasks, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Clear tasks on error
    } finally {
      setTasksLoading(false);
    }
  }, [taskList._id]); // Dependency: taskList._id

  useEffect(() => {
    if (taskList?._id) {
      // Ensure taskList and its _id are available
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks if no valid taskList
      setTasksLoading(false);
    }
  }, [fetchTasks, taskList?._id]); // fetchTasks is now a dependency

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    setIsAddingTask(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTaskTitle, listId: taskList._id }),
        }
      );
      if (response.ok) {
        setNewTaskTitle("");
        setShowAddTask(false);
        fetchTasks();
      } else {
        // Consider setting an error state here to display to the user
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // Consider setting an error state here
    } finally {
      setIsAddingTask(false);
    }
  }, [newTaskTitle, taskList._id, fetchTasks]);

  const handleTaskCompletion = useCallback(
    async (taskId, completed) => {
      try {
        const token = localStorage.getItem("token");
        const task = tasks.find((t) => t._id === taskId);
        if (!task) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              completed: completed,
            }),
          }
        );
        if (response.ok) {
          fetchTasks();
        }
      } catch (error) {
        console.error("Error updating task completion:", error);
      }
    },
    [tasks, fetchTasks]
  );

  const handleDeleteList = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists/${taskList._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setShowDeleteConfirm(false);
        if (onDelete) onDelete(taskList._id);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  }, [taskList._id, onDelete, onUpdate]);

  const handleTaskEdit = useCallback((task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  }, []);

  const handleTaskUpdate = useCallback(() => {
    fetchTasks();
    setShowTaskModal(false);
  }, [fetchTasks]);

  return (
    <div className="card space-y-4 border border-[var(--ctp-surface1)]">
      {" "}
      {/* Use .card and theme border */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold text-[var(--ctp-text)]">
            {taskList.name}
          </h3>
          <h4 className="text-sm text-[var(--ctp-subtext0)]">
            {taskList.description}
          </h4>
          {taskList.goal && (
            <span className="text-xs text-[var(--ctp-subtext1)] bg-[var(--ctp-surface0)] px-2 py-0.5 rounded-full">
              {taskList.goal.title}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-[var(--ctp-green)] text-[var(--ctp-base)] w-7 h-7 rounded-md flex items-center justify-center hover:opacity-80 text-sm transition-opacity"
            title="Add Task"
          >
            +
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-[var(--ctp-red)] text-[var(--ctp-base)] w-7 h-7 rounded-md flex items-center justify-center hover:opacity-80 transition-opacity"
            title="Delete List"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {showAddTask && (
        <div className="bg-[var(--ctp-surface0)] rounded-md p-3 border border-[var(--ctp-surface1)]">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="input-field flex-1 px-2 py-1 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="bg-[var(--ctp-green)] text-[var(--ctp-base)] px-3 py-1 text-sm rounded-md hover:opacity-80 transition-opacity font-medium"
              disabled={isAddingTask}
            >
              {isAddingTask ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => {
                if (isAddingTask) return; // Prevent closing while adding
                setShowAddTask(false);
                setNewTaskTitle("");
              }}
              className="button-secondary px-3 py-1 text-sm"
              disabled={isAddingTask}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {tasksLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--ctp-peach)] mx-auto"></div>
            <p className="text-[var(--ctp-subtext0)] text-sm mt-2">Loading tasks...</p>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
          <div
            key={task._id}
            className={`p-3 border rounded-md transition-colors ${
              task.completed
                ? "bg-[var(--ctp-green)]/10 border-[var(--ctp-green)]/30" // Lighter green touch for completed
                : "border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)] hover:bg-[var(--ctp-surface1)]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  handleTaskCompletion(task._id, e.target.checked)
                }
                className="w-4 h-4 text-[var(--ctp-peach)] rounded-sm focus:ring-[var(--ctp-peach)] focus:ring-2 cursor-pointer bg-[var(--ctp-surface1)] border-2 border-[var(--ctp-surface2)] transition-all"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-sm ${
                    task.completed
                      ? "line-through text-[var(--ctp-subtext0)]"
                      : "text-[var(--ctp-text)]"
                  }`}
                >
                  {task.title}
                </span>
                {task.description && (
                  <p className="text-xs text-[var(--ctp-overlay1)] mt-1 truncate">
                    {task.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleTaskEdit(task)}
                className="text-[var(--ctp-sky)] hover:text-[var(--ctp-blue)] p-2 rounded-md hover:bg-[var(--ctp-surface1)] transition-all"
                title="Edit Task"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
            {tasks.length === 0 && !tasksLoading && (
              <p className="text-[var(--ctp-subtext0)] text-center py-4 text-sm">
                No tasks yet. Add your first task!
              </p>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[var(--ctp-base)]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--ctp-mantle)] rounded-lg p-6 max-w-sm w-full border border-[var(--ctp-surface1)] shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-[var(--ctp-red)]/20 flex items-center justify-center border border-[var(--ctp-red)]/30">
                <svg
                  className="w-4 h-4 text-[var(--ctp-red)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-[var(--ctp-text)]">
                  Delete Task List
                </h3>
                <p className="text-xs text-[var(--ctp-subtext0)]">
                  "{taskList.name}"
                </p>
              </div>
            </div>
            <div className="bg-[var(--ctp-red)]/10 border border-[var(--ctp-red)]/30 rounded-md p-3 mb-4">
              <p className="text-sm text-[var(--ctp-red)]">
                This will permanently delete the list and all {tasks.length}{" "}
                task(s). This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="button-secondary px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteList}
                className="button-danger px-4 py-2 text-sm font-medium"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}
      {showTaskModal && (
        <TaskModal // Assuming TaskModal will also need theming, or will inherit body styles
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskBoard;
