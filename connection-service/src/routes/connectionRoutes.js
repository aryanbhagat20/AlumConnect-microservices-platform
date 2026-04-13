import express from 'express';
import {
  sendRequest, acceptRequest, rejectRequest,
  getPendingRequests, getMyConnections, getConnectionStatus,
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/request/:userId',          sendRequest);
router.put('/accept/:connectionId',      acceptRequest);
router.put('/reject/:connectionId',      rejectRequest);
router.get('/pending',                   getPendingRequests);
router.get('/',                          getMyConnections);
router.get('/status/:userId',            getConnectionStatus);

export default router;