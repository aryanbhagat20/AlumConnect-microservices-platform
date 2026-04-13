import { Event } from '../models/Event.js';
import { publishEvent } from '../events/publisher.js';

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.headers['x-user-id'],
    });

    await publishEvent('event.created', {
      eventId:   event._id,
      title:     event.title,
      createdBy: req.headers['x-user-id'],
      audience:  event.targetAudience,
    });

    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.status(200).json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.status(200).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const isOwner = event.createdBy.toString() === req.headers['x-user-id'];
    if (!isOwner && req.headers['x-user-role'] !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, event: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const isOwner = event.createdBy.toString() === req.headers['x-user-id'];
    if (!isOwner && req.headers['x-user-role'] !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};