const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private (Project Member)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create task
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Project Member)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      project: req.params.projectId,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
    });

    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status, priority, dueDate },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Project Admin or Task Creator)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const myTasks = await Task.find({ assignedTo: req.user._id });
    
    const stats = {
      total: myTasks.length,
      pending: myTasks.filter(t => t.status === 'pending').length,
      inProgress: myTasks.filter(t => t.status === 'in-progress').length,
      completed: myTasks.filter(t => t.status === 'completed').length,
      overdue: myTasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length,
    };

    const recentTasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        stats,
        recentTasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};