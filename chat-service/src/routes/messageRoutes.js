import express from 'express';
import { getConversation, getInbox } from '../controllers/messageController.js';

const router = express.Router();
router.get('/inbox',     getInbox);        // Must be BEFORE /:userId
router.get('/:userId',  getConversation);

export default router;