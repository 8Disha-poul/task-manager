import React, { useEffect, useState } from "react";
import "./TaskComplete.css";

const TaskComplete = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks/completed");
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      setError("Failed to load completed tasks");
    } finally {
      setLoading(false);
    }
  };

  // Wrap the whole output in a div with a unique class
  return (
    <div className="task-list-wrapper">
      {loading && (
        <div className="task-loading">
          <div className="spinner"></div>
          <p>Loading completed tasks...</p>
        </div>
      )}

      {error && <div className="task-error">{error}</div>}

      {!loading && !error && (
        <div className="task-container">
          <div className="task-header">
            <h2>
              <span className="glow">✅</span> Completed Tasks
            </h2>
            <p>All the tasks which you have successfully finished</p>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No completed tasks yet</p>
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <div className="task-card-header">
                    <h3>
                      <span className="task-icon">⚡</span> {task.title}
                    </h3>
                    <span className="badge">Completed</span>
                  </div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    {/* optional date */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskComplete;