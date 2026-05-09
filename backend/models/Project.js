const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active',
  },
  deadline: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);