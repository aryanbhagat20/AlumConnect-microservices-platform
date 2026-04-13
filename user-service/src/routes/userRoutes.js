import express from 'express';
import {
  getAllAlumni, getAllStudents, getUserById,
  updateProfile, getAllUsers, toggleUserStatus, deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/alumni',              getAllAlumni);
router.get('/students',            getAllStudents);
router.get('/',                    getAllUsers);
router.get('/:id',                 getUserById);
router.put('/profile',             updateProfile);
router.put('/:id/toggle-status',   toggleUserStatus);
router.delete('/:id',              deleteUser);

export default router;