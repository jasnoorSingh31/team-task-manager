const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { isProjectMember } = require('../middleware/roleAuth');

router.route('/')
  .get(protect, isProjectMember, getTasks)
  .post(protect, isProjectMember, createTask);

module.exports = router;