import { User } from '../models/User.js';
import { getCachedUser, setCachedUser, invalidateUser } from '../cache/userCache.js';

export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni', isActive: true }).select('-password');
    res.json({ success: true, alumni });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true }).select('-password');
    res.json({ success: true, students });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const getUserById = async (req, res) => {
  try {
    const cached = await getCachedUser(req.params.id);
    if (cached) return res.json({ success: true, user: cached, fromCache: true });

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    await setCachedUser(req.params.id, user.toObject());
    res.json({ success: true, user });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const updateProfile = async (req, res) => {
  try {
    ['password','role','email','isActive'].forEach(f => delete req.body[f]);
    const userId = req.headers['x-user-id'];
    const user = await User.findByIdAndUpdate(
      userId, { $set: req.body }, { new: true }
    ).select('-password');
    await invalidateUser(userId);
    res.json({ success: true, user });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.headers['x-user-role'] !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin only.' });
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const toggleUserStatus = async (req, res) => {
  try {
    if (req.headers['x-user-role'] !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin only.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    await invalidateUser(req.params.id);
    res.json({ success: true, user });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.headers['x-user-role'] !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin only.' });
    await User.findByIdAndDelete(req.params.id);
    await invalidateUser(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
};