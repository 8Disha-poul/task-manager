import { useEffect, useState } from "react";
import { getPendingTasks, completeTask } from "../services/taskService";
import TaskItem from "./TaskItem";
import "./PendingTask.css"; // Create this CSS file

const TaskItems = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleComplete = async (id) => {
    await completeTask(id);
    loadTasks();
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h2 className="task-header-title">
          <span className="header-icon">⚡</span>
          Pending Tasks
          <span className="task-count-badge">{tasks.length}</span>
        </h2>
        <div className="header-glow"></div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <span className="loading-text">Loading tasks...</span>
          </div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="tasks-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onUpdate={loadTasks}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No Pending Tasks</h3>
          <p className="empty-state-message">
            Your task queue is empty. Time to add some new challenges!
          </p>
          <div className="empty-state-glow"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItems;