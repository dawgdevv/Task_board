import { useState } from "react";

const EditGoalModal = ({ goal, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: goal.title || "",
    description: goal.description || "",
    targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : "",
    priority: goal.priority || "medium",
    category: goal.category || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${goal._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        onUpdated();
      } else {
        setError("Failed to update goal");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--ctp-base)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-lg shadow-2xl"> {/* Use .card and adjust specific styles if needed */}
        <div className="bg-[var(--ctp-crust)] px-6 py-4 border-b border-[var(--ctp-surface1)] flex justify-between items-center rounded-t-lg">
          <h3 className="text-lg font-bold text-[var(--ctp-text)]">Edit Goal</h3>
          <button
            onClick={onClose}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-[var(--ctp-red)]/20 text-[var(--ctp-red)] border border-[var(--ctp-red)]/50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field w-full px-3 py-2 placeholder-[var(--ctp-overlay0)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field w-full px-3 py-2 placeholder-[var(--ctp-overlay0)] resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
                Target Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="input-field w-full px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field w-full px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field w-full px-3 py-2 placeholder-[var(--ctp-overlay0)]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary px-4 py-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary px-4 py-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;
