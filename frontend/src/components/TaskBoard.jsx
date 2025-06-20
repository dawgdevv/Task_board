import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";

const TaskBoard = ({ taskList, onUpdate, onDelete }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useEffect(() => {
    fetchTasks();
  });
  const fetchTasks = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

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
          body: JSON.stringify({
            title: newTaskTitle,
            listId: taskList._id,
          }),
        }
      );

      if (response.ok) {
        setNewTaskTitle("");
        setShowAddTask(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskCompletion = async (taskId, completed) => {
    try {
      const token = localStorage.getItem("token");
      const task = tasks.find((t) => t._id === taskId);

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
  };

  const handleDeleteList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists/${taskList._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setShowDeleteConfirm(false);
        if (onDelete) {
          onDelete(taskList._id);
        }
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskUpdate = () => {
    fetchTasks();
    setShowTaskModal(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold text-white">
            {taskList.name}
          </h3>
          <h4>{taskList.description}</h4>
          {taskList.goal && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
              {taskList.goal.title}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-700 text-sm"
            title="Add Task"
          >
            +
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700"
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
        <div className="bg-gray-750 rounded-md p-3 border border-gray-600">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddTask(false);
                setNewTaskTitle("");
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`p-3 border rounded-md transition-colors ${
              task.completed
                ? "bg-green-900/20 border-green-700/50"
                : "border-gray-600 bg-gray-750/50 hover:bg-gray-700/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  handleTaskCompletion(task._id, e.target.checked)
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-sm ${
                    task.completed ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {task.title}
                </span>
                {task.description && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {task.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleTaskEdit(task)}
                className="text-gray-400 hover:text-blue-400 p-1"
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
      </div>

      {tasks.length === 0 && (
        <p className="text-gray-400 text-center py-4 text-sm">
          No tasks yet. Add your first task!
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-4 max-w-sm w-full border border-gray-600">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-400"
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
                <h3 className="text-base font-medium text-white">
                  Delete Task List
                </h3>
                <p className="text-xs text-gray-400">"{taskList.name}"</p>
              </div>
            </div>
            <div className="bg-red-900 border border-red-700 rounded p-2 mb-3">
              <p className="text-xs text-red-300">
                This will permanently delete the list and all {tasks.length}{" "}
                task(s). Cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteList}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskBoard;
