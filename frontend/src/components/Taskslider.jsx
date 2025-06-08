import { useState } from "react";

const Taskslider = ({
  taskLists,
  selectedListIndex,
  onListSelect,
  onListDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDeleteList = async (listId) => {
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
    <div className="relative mb-4">
      {/* Compact Slider Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-800 rounded-md shadow-sm p-3 flex items-center justify-between hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:shadow-md"
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
          <span className="text-sm font-medium text-white truncate">
            {taskLists.length > 0 && selectedListIndex >= 0
              ? taskLists[selectedListIndex]?.name || "Select a List"
              : "Select Task List"}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            ({taskLists.length})
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
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
      </button>

      {/* Enhanced Expanded Dropdown with Better Overflow */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-gray-800 rounded-md shadow-xl border border-gray-600 overflow-hidden">
          {/* Header with count info */}
          {taskLists.length > 0 && (
            <div className="px-3 py-2 bg-gray-750 border-b border-gray-600">
              <span className="text-xs text-gray-400">
                {taskLists.length} task list{taskLists.length !== 1 ? "s" : ""}{" "}
                available
              </span>
            </div>
          )}

          {/* Scrollable List Container */}
          <div
            className={`overflow-y-auto ${
              taskLists.length > 6 ? "max-h-64" : "max-h-80"
            }`}
          >
            {taskLists.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-700 flex items-center justify-center">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-sm">No task lists available</p>
                <p className="text-xs mt-1">
                  Create your first list to get started
                </p>
              </div>
            ) : (
              <div className="py-1">
                {taskLists.map((list, index) => (
                  <div
                    key={list._id}
                    className={`group relative flex items-center justify-between hover:bg-gray-700 transition-colors cursor-pointer ${
                      selectedListIndex === index
                        ? "bg-indigo-900/50 border-l-2 border-indigo-400"
                        : ""
                    }`}
                    onClick={() => {
                      onListSelect(index);
                      setIsExpanded(false);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0 px-3 py-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          selectedListIndex === index
                            ? "bg-indigo-400"
                            : "bg-gray-500 group-hover:bg-gray-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm font-medium truncate ${
                              selectedListIndex === index
                                ? "text-indigo-200"
                                : "text-gray-200"
                            }`}
                            title={list.name}
                          >
                            {list.name}
                          </span>
                          {selectedListIndex === index && (
                            <svg
                              className="w-3 h-3 text-indigo-400 flex-shrink-0"
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
                        </div>
                        {list.goal && (
                          <div
                            className="text-xs text-gray-400 truncate mt-0.5"
                            title={`Goal: ${list.goal.title}`}
                          >
                            {list.goal.title}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center px-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(list);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
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
                ))}
              </div>
            )}
          </div>

          {/* Footer with scroll indicator if needed */}
          {taskLists.length > 6 && (
            <div className="px-3 py-1 bg-gray-750 border-t border-gray-600">
              <div className="flex items-center justify-center text-xs text-gray-400">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7l4-4m0 0l4 4m-4-4v18"
                  />
                </svg>
                Scroll for more
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Quick Access - Horizontal Scroll */}
      <div className="mt-2 md:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {taskLists.map((list, index) => (
            <button
              key={list._id}
              onClick={() => onListSelect(index)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedListIndex === index
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {list.name}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-5 max-w-md w-full border border-gray-600 shadow-2xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/80 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-400"
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
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Delete Task List
                </h3>
                <p className="text-sm text-gray-300 break-words">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-white">
                    "{showDeleteConfirm.name}"
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-700/50 rounded-md p-3 mb-4">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
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
                <div>
                  <p className="text-sm text-red-300">
                    This will permanently delete the list and all tasks in it.
                    This action cannot be undone.
                  </p>
                  {showDeleteConfirm.goal && (
                    <p className="text-sm text-red-300 mt-2">
                      This list is part of goal:{" "}
                      <span className="font-medium">
                        {showDeleteConfirm.goal.title}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteList(showDeleteConfirm._id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
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
