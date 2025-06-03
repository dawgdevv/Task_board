import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";

const TaskBoard = ({ taskList, onUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [taskList._id]);

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

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskUpdate = () => {
    fetchTasks();
    setShowTaskModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{taskList.name}</h3>
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700"
        >
          +
        </button>
      </div>

      {showAddTask && (
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddTask(false);
                setNewTaskTitle("");
              }}
              className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 text-sm"
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
            onClick={() => handleTaskClick(task)}
            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
              task.completed
                ? "bg-green-50 border-green-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                readOnly
                className="w-4 h-4 text-blue-600"
              />
              <span
                className={`flex-1 ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {task.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No tasks yet. Add your first task!
        </p>
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
