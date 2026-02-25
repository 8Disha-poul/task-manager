import { useState } from "react";
import { updateTask, deleteTask } from "../services/taskService";
import "./PendingTask.css"; // Create this CSS file

const TaskItem = ({ task, onComplete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      description
    });
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onUpdate();
  };

  return (
    <div className={`task-card ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <div className="input-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="task-input"
            />
          </div>

          <div className="input-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="task-textarea"
              rows="3"
            />
          </div>

          <div className="edit-actions">
            <button onClick={handleSave} className="btn btn-save">
              <span className="btn-icon">💾</span>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-cancel">
              <span className="btn-icon">✖</span>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.description}</p>
          </div>

          <div className="task-actions">
            <button 
              onClick={() => onComplete(task.id)} 
              className="action-btn complete-btn"
              title="Mark as complete"
            >
              <span className="btn-icon">✓</span>
              <span className="btn-text">Complete</span>
            </button>

            <button 
              onClick={() => setIsEditing(true)} 
              className="action-btn edit-btn"
              title="Edit task"
            >
              <span className="btn-icon">✎</span>
              <span className="btn-text">Edit</span>
            </button>

            <button 
              onClick={handleDelete} 
              className="action-btn delete-btn"
              title="Delete task"
            >
              <span className="btn-icon">🗑</span>
              <span className="btn-text">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;