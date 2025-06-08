import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import Taskslider from "../components/Taskslider";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTaskLists = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTaskLists(data);
      if (data.length > 0 && selectedListIndex === -1) {
        setSelectedListIndex(0);
      }
    } catch (error) {
      console.error("Error fetching task lists:", error);
      setError(
        "Failed to load task lists. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedListIndex]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTaskLists();
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate, fetchTaskLists]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleListSelect = (index) => {
    setSelectedListIndex(index);
  };

  const groupTaskListsByGoal = () => {
    const grouped = {};
    taskLists.forEach((list) => {
      const goalId = list.goal?._id || "unassigned";

      if (!grouped[goalId]) {
        grouped[goalId] = {
          goal: list.goal,
          lists: [],
        };
      }
      grouped[goalId].lists.push(list);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              onClick={() => {
                setError("");
                fetchTaskLists();
              }}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedTasks = groupTaskListsByGoal();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(groupedTasks).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([goalId, data]) => (
              <div
                key={goalId}
                className="bg-gray-800 rounded-lg shadow-lg p-6"
              >
                {data.goal ? (
                  <div className="border-b border-gray-700 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          🎯 {data.goal.title}
                        </h3>
                        {data.goal.description && (
                          <p className="text-gray-300 mb-2">
                            {data.goal.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {data.goal.category && (
                            <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs">
                              {data.goal.category}
                            </span>
                          )}
                          <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-xs">
                            Due: {new Date(data.goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/goal/${goalId}`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        Manage Goal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-700 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-white">
                      📋 Unassigned Tasks
                    </h3>
                    <p className="text-gray-300">
                      Tasks not linked to any specific goal
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.lists.map((list) => (
                    <div
                      key={list._id}
                      onClick={() => {
                        if (data.goal) {
                          navigate(`/goal/${goalId}`);
                        } else {
                          setSelectedListIndex(
                            taskLists.findIndex((tl) => tl._id === list._id)
                          );
                        }
                      }}
                      className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-gray-700 hover:bg-gray-650"
                    >
                      <h4 className="font-medium text-white mb-2">
                        {list.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Click to manage tasks
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg shadow-md p-8">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                No goals yet. Start by creating your first long-term goal!
              </p>
              <button
                onClick={() => navigate("/goals")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        )}

        {selectedListIndex >= 0 && taskLists[selectedListIndex] && (
          <div className="mt-8">
            <Taskslider
              taskLists={taskLists}
              selectedListIndex={selectedListIndex}
              onListSelect={handleListSelect}
            />

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <TaskBoard
                key={taskLists[selectedListIndex]?._id}
                taskList={taskLists[selectedListIndex]}
                onUpdate={fetchTaskLists}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
