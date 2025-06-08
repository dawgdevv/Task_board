import { useState } from "react";

const Taskslider = ({ taskLists, selectedListIndex, onListSelect, onListDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDeleteList = async (listId, listName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/lists/${listId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setShowDeleteConfirm(null);
        if (onListDelete) {
          onListDelete(listId);
        }
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div className="relative mb-6">
      {/* Slider Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow border border-gray-700 hover:border-gray-600"
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
          <span className="text-lg font-medium text-white">
            {taskLists.length > 0 && selectedListIndex >= 0
              ? taskLists[selectedListIndex]?.name || "Select a List"
              : "Select a Task List"}
          </span>
          <span className="text-sm text-gray-400">
            ({taskLists.length} lists)
          </span>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Slider */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 max-h-80 overflow-y-auto">
          <div className="p-2">
            {taskLists.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No task lists available
              </div>
            ) : (
              <div className="space-y-1">
                {taskLists.map((list, index) => (
                  <div
                    key={list._id}
                    className={`w-full text-left p-3 rounded-md transition-colors flex items-center justify-between group ${
                      selectedListIndex === index
                        ? "bg-indigo-900 border border-indigo-700 text-indigo-200"
                        : "hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => {
                        onListSelect(index);
                        setIsExpanded(false);
                      }}
                      className="flex items-center space-x-3 flex-1"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedListIndex === index
                            ? "bg-indigo-400"
                            : "bg-gray-500 group-hover:bg-gray-400"
                        }`}
                      ></div>
                      <div className="flex-1 text-left">
                        <span className="font-medium">{list.name}</span>
                        {list.goal && (
                          <div className="text-xs text-gray-400 mt-1">
                            Goal: {list.goal.title}
                          </div>
                        )}
                      </div>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {selectedListIndex === index && (
                        <svg
                          className="w-4 h-4 text-indigo-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(list);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
                        title="Delete List"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile-friendly horizontal scroll slider for quick access */}
      <div className="mt-3 md:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {taskLists.map((list, index) => (
            <div key={list._id} className="relative flex-shrink-0">
              <button
                onClick={() => onListSelect(index)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedListIndex === index
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {list.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Delete Task List</h3>
                <p className="text-sm text-gray-400">
                  Are you sure you want to delete "{showDeleteConfirm.name}"?
                </p>
              </div>
            </div>
            <div className="bg-red-900 border border-red-700 rounded-md p-3 mb-4">
              <p className="text-sm text-red-300">
                <strong>Warning:</strong> This will permanently delete the list and all tasks in it. This action cannot be undone.
              </p>
              {showDeleteConfirm.goal && (
                <p className="text-sm text-red-300 mt-2">
                  This list is part of goal: <strong>{showDeleteConfirm.goal.title}</strong>
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteList(showDeleteConfirm._id, showDeleteConfirm.name)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskslider;
