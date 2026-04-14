import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent }
  from '../controllers/eventController.js';

const router = express.Router();
router.post('/',                createEvent);
router.get('/',                 getEvents);
router.get('/:id',              getEventById);
router.put('/:id',              updateEvent);
router.delete('/:id',           deleteEvent);
router.post('/:id/register',    registerForEvent);
router.post('/:id/unregister',  unregisterFromEvent);

export default router;