import { Connection } from '../models/Connection.js';
import { publishEvent } from '../events/publisher.js';

export const sendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.headers['x-user-id'];

    if (userId === myId)
      return res.status(400).json({ success: false, message: 'Cannot connect to yourself.' });

    const existing = await Connection.findOne({
      $or: [
        { requester: myId, recipient: userId },
        { requester: userId, recipient: myId },
      ],
    });

    if (existing) {
      const msg = existing.status === 'accepted'
        ? 'Already connected.' : 'Request already pending.';
      return res.status(409).json({ success: false, message: msg });
    }

    const connection = await Connection.create({
      requester: myId,
      recipient: userId,
      status: 'pending',
    });

    // Publish event — Notification Service will alert the recipient
    await publishEvent('connection.request', {
      requesterId: myId,
      recipientId: userId,
      connectionId: connection._id,
    });

    res.status(201).json({ success: true, connection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const myId = req.headers['x-user-id'];
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ success: false, message: 'Request not found.' });

    if (connection.recipient.toString() !== myId)
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    // Atomic status update — concurrency safe
    const updated = await Connection.findByIdAndUpdate(
      req.params.connectionId,
      { $set: { status: 'accepted' } },
      { new: true }
    );

    // Publish accepted event
    await publishEvent('connection.accepted', {
      requesterId: connection.requester.toString(),
      recipientId: myId,
    });

    res.status(200).json({ success: true, message: 'Connection accepted.', connection: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const myId = req.headers['x-user-id'];
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ success: false, message: 'Request not found.' });

    if (connection.recipient.toString() !== myId)
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    await Connection.findByIdAndUpdate(req.params.connectionId,
      { $set: { status: 'rejected' } }, { new: true });

    res.status(200).json({ success: true, message: 'Connection rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.headers['x-user-id'],
      status: 'pending',
    });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.headers['x-user-id'], status: 'accepted' },
        { recipient: req.headers['x-user-id'], status: 'accepted' },
      ],
    });
    res.status(200).json({ success: true, connections });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.headers['x-user-id'];
    const connection = await Connection.findOne({
      $or: [
        { requester: myId, recipient: userId },
        { requester: userId, recipient: myId },
      ],
    });

    let status = 'none';
    if (connection) {
      if (connection.status === 'pending')
        status = connection.requester.toString() === myId ? 'request_sent' : 'request_received';
      else if (connection.status === 'accepted') status = 'connected';
    }
    res.status(200).json({ success: true, status });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};