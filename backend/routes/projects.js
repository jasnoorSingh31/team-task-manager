const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addMember,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { isAdmin, isProjectAdmin } = require('../middleware/roleAuth');

router.route('/')
  .get(protect, getProjects)
  .post(protect, isAdmin, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/members', protect, addMember);

module.exports = router;