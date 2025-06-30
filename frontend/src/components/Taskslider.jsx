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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setShowDeleteConfirm(null);
        if (onListDelete) onListDelete(listId);
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-[var(--ctp-mantle)] rounded-md shadow-sm p-3 flex items-center justify-between hover:bg-[var(--ctp-surface0)] transition-all duration-200 border border-[var(--ctp-surface1)] hover:border-[var(--ctp-surface2)] hover:shadow-md"
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="w-2 h-2 bg-[var(--ctp-peach)] rounded-full flex-shrink-0"></div>
          <span className="text-sm font-medium text-[var(--ctp-text)] truncate">
            {taskLists.length > 0 && selectedListIndex >= 0
              ? taskLists[selectedListIndex]?.name || "Select a List"
              : "Select Task List"}
          </span>
          <span className="text-xs text-[var(--ctp-subtext0)] flex-shrink-0">
            ({taskLists.length})
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--ctp-overlay1)] transform transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--ctp-mantle)] rounded-md shadow-xl border border-[var(--ctp-surface1)] overflow-hidden">
          {taskLists.length > 0 && (
            <div className="px-3 py-2 bg-[var(--ctp-crust)] border-b border-[var(--ctp-surface0)]">
              <span className="text-xs text-[var(--ctp-subtext0)]">
                {taskLists.length} task list{taskLists.length !== 1 ? "s" : ""} available
              </span>
            </div>
          )}
          <div className={`overflow-y-auto scrollbar-thin scrollbar-track-[var(--ctp-crust)] scrollbar-thumb-[var(--ctp-surface1)] ${taskLists.length > 6 ? "max-h-64" : "max-h-80"}`}>
            {taskLists.length === 0 ? (
              <div className="p-4 text-center text-[var(--ctp-subtext0)]">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[var(--ctp-surface0)] flex items-center justify-center text-[var(--ctp-overlay1)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm">No task lists available</p>
                <p className="text-xs mt-1">Create your first list to get started</p>
              </div>
            ) : (
              <div className="py-1">
                {taskLists.map((list, index) => (
                  <div
                    key={list._id}
                    className={`group relative flex items-center justify-between hover:bg-[var(--ctp-surface0)] transition-colors cursor-pointer ${selectedListIndex === index ? "bg-[var(--ctp-peach)]/20 border-l-2 border-[var(--ctp-peach)]" : ""}`}
                    onClick={() => { onListSelect(index); setIsExpanded(false); }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0 px-3 py-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedListIndex === index ? "bg-[var(--ctp-peach)]" : "bg-[var(--ctp-overlay1)] group-hover:bg-[var(--ctp-overlay2)]"}`}/>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium truncate ${selectedListIndex === index ? "text-[var(--ctp-peach)]" : "text-[var(--ctp-text)]"}`} title={list.name}>
                            {list.name}
                          </span>
                          {selectedListIndex === index && (
                            <svg className="w-3 h-3 text-[var(--ctp-peach)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        {list.goal && (
                          <div className="text-xs text-[var(--ctp-subtext1)] truncate mt-0.5" title={`Goal: ${list.goal.title}`}>
                            {list.goal.title}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center px-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(list); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--ctp-red)] hover:text-[var(--ctp-red)]/80 p-1 rounded hover:bg-[var(--ctp-red)]/20"
                        title="Delete List"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {taskLists.length > 6 && (
            <div className="px-3 py-1 bg-[var(--ctp-crust)] border-t border-[var(--ctp-surface0)]">
              <div className="flex items-center justify-center text-xs text-[var(--ctp-subtext0)]">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18"/>
                </svg>
                Scroll for more
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 md:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {taskLists.map((list, index) => (
            <button
              key={list._id}
              onClick={() => onListSelect(index)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedListIndex === index ? "bg-[var(--ctp-peach)] text-[var(--ctp-base)]" : "bg-[var(--ctp-surface0)] text-[var(--ctp-subtext0)] hover:bg-[var(--ctp-surface1)]"}`}
            >
              {list.name}
            </button>
          ))}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[var(--ctp-base)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card p-5 max-w-md w-full shadow-2xl"> {/* Use .card */}
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--ctp-red)]/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--ctp-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-1">Delete Task List</h3>
                <p className="text-sm text-[var(--ctp-subtext0)] break-words">
                  Are you sure you want to delete <span className="font-medium text-[var(--ctp-text)]">"{showDeleteConfirm.name}"</span>?
                </p>
              </div>
            </div>
            <div className="bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 rounded-md p-3 mb-4">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-[var(--ctp-red)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div>
                  <p className="text-sm text-[var(--ctp-red)]">This will permanently delete the list and all tasks in it. This action cannot be undone.</p>
                  {showDeleteConfirm.goal && (
                    <p className="text-sm text-[var(--ctp-red)] mt-2">This list is part of goal: <span className="font-medium">{showDeleteConfirm.goal.title}</span></p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="button-secondary px-4 py-2 text-sm font-medium">
                Cancel
              </button>
              <button onClick={() => handleDeleteList(showDeleteConfirm._id)} className="button-danger px-4 py-2 text-sm font-medium">
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
