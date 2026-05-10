import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/authContext';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await taskAPI.getDashboard();
      setDashboard(data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { stats, recentTasks } = dashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon="🚀"
          color="purple"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet</p>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </div>
  );
}

function TaskItem({ task }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {task.project?.name}
            </span>
          </div>
        </div>
        {task.dueDate && (
          <div className="text-sm text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}