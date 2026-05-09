const Project = require('../models/Project');

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

// Check if user is project admin or owner
const isProjectAdmin = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() === req.user._id.toString()) {
      return next();
    }

    // Check if user is project admin
    const member = project.members.find(
      m => m.user.toString() === req.user._id.toString() && m.role === 'admin'
    );

    if (member) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. Project admin role required.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check if user is project member
const isProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() === req.user._id.toString()) {
      return next();
    }

    // Check if user is a member
    const isMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. You must be a project member.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { isAdmin, isProjectAdmin, isProjectMember };