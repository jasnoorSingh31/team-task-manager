const express = require('express');
const router = express.Router();
const {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboard,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { isProjectMember } = require('../middleware/roleAuth');

router.get('/my-tasks', protect, getMyTasks);
router.get('/dashboard', protect, getDashboard);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;