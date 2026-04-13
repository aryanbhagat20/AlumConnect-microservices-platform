import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: { type: String, default: '' },
  date: { type: Date, required: [true, 'Event date is required'] },
  location: { type: String, default: 'Online' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  targetAudience: {
    type: String,
    enum: ['all', 'alumni', 'student'],
    default: 'all',
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Event = mongoose.model('Event', eventSchema);