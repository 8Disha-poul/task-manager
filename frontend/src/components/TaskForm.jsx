import React, { useState } from "react";
import { addTask } from "../services/taskService";
import "./TaskForm.css";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill all fields");

    await addTask({ title, description });
    setTitle("");
    setDescription("");
    alert("Task added successfully!");
  };

  return (
    <div className="taskform-container">
      <h2>Add New Task</h2>
      <form className="taskform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
