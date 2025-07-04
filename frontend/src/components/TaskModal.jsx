import { useState, useEffect } from "react";

const TaskModal = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    }
  }, [task]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            completed: task.completed, // Keep existing completion status
          }),
        }
      );

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--ctp-base)]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[var(--ctp-text)]">
            Edit Task
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--ctp-subtext0)] hover:text-[var(--ctp-text)] p-2 rounded-md hover:bg-[var(--ctp-surface0)] transition-all"
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full px-3 py-2 placeholder-[var(--ctp-overlay0)]"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="input-field w-full px-3 py-2 placeholder-[var(--ctp-overlay0)] resize-none"
              placeholder="Add task description..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleUpdate}
              className="button-primary flex-1 py-2 px-4 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="button-danger py-2 px-4 font-medium"
            >
              Delete
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-6 p-4 bg-[var(--ctp-red)]/10 rounded-md border border-[var(--ctp-red)]/30">
              <p className="text-sm text-[var(--ctp-red)] mb-4">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="button-danger flex-1 py-2 px-3 text-sm font-medium"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="button-secondary flex-1 py-2 px-3 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
