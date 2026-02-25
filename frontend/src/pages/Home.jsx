// import React from "react";
// import TaskForm from "../components/TaskForm";
// import TaskComplete from "../components/TaskComplete";
// import TaskItems from "../components/taskitems";


// const Home = () => {
//   return (
//     <div>
//       <h1>Task Manager</h1>
//       <TaskForm />
//       <TaskComplete/>
//       <TaskItems/> 
//       <TaskItems/>
      
    

     
//     </div>
//   );
// };

// export default Home;



import React, { useState, useEffect } from "react";
import { 
  getPendingTasks, 
  getCompletedTasks, 
  getTaskStats,
  getAllTasksWithStats,
  completeTask,
  deleteTask,
  addTask 
} from '../services/taskService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle,
  faCircle,
  faClock,
  faFlag,
  faPlus,
  faSearch,
  faBell,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import TaskForm from "../components/TaskForm";
import TaskComplete from "../components/TaskComplete";
import TaskItems from "../components/taskitems";
import './Home.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || { 
    name: 'John Doe', 
    email: 'john@example.com' 
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTasksWithStats();
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      if (currentStatus === 'Pending') {
        await completeTask(taskId);
      }
      await fetchData();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTask(taskId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      await addTask(newTask);
      await fetchData();
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (searchTerm && !task.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'pending') return task.status === 'Pending';
    return true;
  });

  const activeTasks = filteredTasks.filter(t => t.status === 'Pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <FontAwesomeIcon icon={faCheckCircle} className="logo-icon" />
            <span>TaskFlow</span>
          </div>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="progress-section">
            <div className="progress-label">
              <span>Progress</span>
              <span>{stats.completed}/{stats.total}</span>
            </div>
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{ width: `${stats.total > 0 ? (stats.completed/stats.total)*100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="date">{currentDate}</p>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="notification-btn">
              <span className="badge">{stats.overdue}</span>
              <FontAwesomeIcon icon={faBell} />
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => setFilter('all')}>
            <div className="stat-icon total">
              <FontAwesomeIcon icon={faCircle} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          
          <div className="stat-card" onClick={() => setFilter('completed')}>
            <div className="stat-icon completed">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div className="stat-card" onClick={() => setFilter('pending')}>
            <div className="stat-icon pending">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon overdue">
              <FontAwesomeIcon icon={faFlag} />
            </div>
            <div className="stat-info">
              <h3>{stats.overdue}</h3>
              <p>Overdue</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => {
              setFilter('completed');
              setShowCompleted(!showCompleted); // Toggle completed view when clicking completed tab
            }}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`action-btn ${showTaskForm ? 'active' : ''}`}
            onClick={() => {
              setShowTaskForm(!showTaskForm);
              if (showCompleted) setShowCompleted(false); // Hide completed when showing form
            }}
          >
            <FontAwesomeIcon icon={showTaskForm ? faTimes : faPlus} />
            {showTaskForm ? 'Close Form' : 'Add New Task'}
          </button>
          
          <button 
            className={`action-btn ${showCompleted ? 'active' : ''}`}
            onClick={() => {
              setShowCompleted(!showCompleted);
              if (showTaskForm) setShowTaskForm(false); // Hide form when showing completed
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>

        {/* Task Form - Shows when Add Task button is clicked */}
        {showTaskForm && (
          <div className="task-form-wrapper">
            <div className="section-header">
              <h2>Create New Task</h2>
              <button 
                className="close-btn"
                onClick={() => setShowTaskForm(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <TaskForm onAddTask={handleAddTask} />
          </div>
        )}

        {/* Task Items - Shows active/pending tasks */}
        {!showCompleted && activeTasks.length > 0 && (
          <div className="tasks-section">
            <div className="section-header">
              <h2>Active Tasks</h2>
              <span className="task-count">{activeTasks.length} tasks</span>
            </div>
            <TaskItems 
              tasks={activeTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          </div>
        )}

        {/* Task Complete - Shows completed tasks when button is clicked */}
        {showCompleted && completedTasks.length > 0 && (
          <div className="tasks-section">
            <div className="section-header">
              <h2>Completed Tasks</h2>
              <span className="task-count">{completedTasks.length} tasks</span>
            </div>
            <TaskComplete 
              tasks={completedTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          </div>
        )}

        {/* Empty State */}
        {!showTaskForm && !showCompleted && activeTasks.length === 0 && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCheckCircle} className="empty-icon" />
            <h3>No active tasks</h3>
            <p>Click "Add New Task" to create your first task</p>
          </div>
        )}

        {showCompleted && completedTasks.length === 0 && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCheckCircle} className="empty-icon" />
            <h3>No completed tasks</h3>
            <p>Complete some tasks to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;