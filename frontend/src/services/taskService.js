
const API_URL = "http://localhost:5000/tasks";

export const addTask = async (taskData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// ===== Get completed tasks =====
export const getCompletedTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/completed`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
  }
};
export const getPendingTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/pending`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching pending tasks:", error);
  }
};

export const completeTask = async (id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/tasks/${id}/complete`,
      { method: "PATCH" }
    );
    return await response.json();
  } catch (error) {
    console.error("Error completing task:", error);
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (id) => {
  const res = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }

  return await res.json();
};


// ===== Get task statistics (counts) =====
export const getTaskStats = async () => {
  try {
    // Get completed tasks count
    const completedRes = await fetch(`${API_URL}/completed`);
    const completedData = await completedRes.json();
    const completedCount = completedData.data ? completedData.data.length : 0;

    // Get pending tasks count
    const pendingRes = await fetch(`${API_URL}/pending`);
    const pendingData = await pendingRes.json();
    const pendingCount = Array.isArray(pendingData) ? pendingData.length : 0;

    // Calculate total
    const totalCount = completedCount + pendingCount;

    return {
      total: totalCount,
      completed: completedCount,
      pending: pendingCount,
      overdue: 0 // You can calculate this if you have due dates
    };
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    };
  }
};

// Get all tasks with stats
export const getAllTasksWithStats = async () => {
  try {
    // Get pending tasks
    const pendingRes = await fetch(`${API_URL}/pending`);
    const pendingData = await pendingRes.json();
    const pendingTasks = Array.isArray(pendingData) ? pendingData : [];

    // Get completed tasks
    const completedRes = await fetch(`${API_URL}/completed`);
    const completedData = await completedRes.json();
    const completedTasks = completedData.data || [];

    // Combine all tasks
    const allTasks = [...pendingTasks, ...completedTasks];

    // Calculate stats
    const stats = {
      total: allTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      overdue: 0
    };

    return {
      tasks: allTasks,
      stats: stats
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      tasks: [],
      stats: { total: 0, completed: 0, pending: 0, overdue: 0 }
    };
  }
};