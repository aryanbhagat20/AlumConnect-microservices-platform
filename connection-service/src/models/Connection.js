import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: { type: String, default: '' }, // optional note from requester
}, { timestamps: true });

// Prevent duplicate requests
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const Connection = mongoose.model('Connection', connectionSchema);