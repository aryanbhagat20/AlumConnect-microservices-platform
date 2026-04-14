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

// Helper: fetch user name from user-service
const fetchUserName = async (userId) => {
  const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
  try {
    const resp = await fetch(`${USER_SERVICE}/users/${userId}`);
    if (resp.ok) {
      const data = await resp.json();
      return { _id: userId, name: data.user?.name || 'Unknown' };
    }
  } catch {}
  return { _id: userId, name: 'Alumni' };
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });

    // Enrich createdBy with user names from user-service
    const enriched = await Promise.all(
      events.map(async (event) => {
        const obj = event.toObject();
        obj.createdBy = await fetchUserName(event.createdBy.toString());
        return obj;
      })
    );

    res.status(200).json({ success: true, events: enriched });
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

// BUG 2 FIX: Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    if (event.attendees.includes(userId)) {
      return res.status(409).json({ success: false, message: 'Already registered.' });
    }

    event.attendees.push(userId);
    await event.save();
    res.status(200).json({ success: true, message: 'Registered successfully.', event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// BUG 2 FIX: Unregister from an event
export const unregisterFromEvent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    event.attendees = event.attendees.filter(id => id.toString() !== userId);
    await event.save();
    res.status(200).json({ success: true, message: 'Unregistered successfully.', event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};