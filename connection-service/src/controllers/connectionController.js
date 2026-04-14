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
    const myId = req.headers['x-user-id'];
    const requests = await Connection.find({
      recipient: myId,
      status: 'pending',
    });

    // Enrich requester info from user-service
    const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
    const enriched = await Promise.all(
      requests.map(async (conn) => {
        const reqObj = conn.toObject();
        try {
          const resp = await fetch(`${USER_SERVICE}/users/${conn.requester}`);
          if (resp.ok) {
            const data = await resp.json();
            reqObj.requester = data.user;
          } else {
            reqObj.requester = { _id: conn.requester.toString(), name: 'Unknown User' };
          }
        } catch {
          reqObj.requester = { _id: conn.requester.toString(), name: 'Unknown User' };
        }
        return reqObj;
      })
    );

    res.status(200).json({ success: true, requests: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const myId = req.headers['x-user-id'];
    const connections = await Connection.find({
      $or: [
        { requester: myId, status: 'accepted' },
        { recipient: myId, status: 'accepted' },
      ],
    });

    // Extract the other user's ID from each connection
    const userIds = connections.map(c =>
      c.requester.toString() === myId ? c.recipient.toString() : c.requester.toString()
    );

    // Fetch user details from user-service for each connected user
    const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
    const enrichedConnections = await Promise.all(
      userIds.map(async (uid) => {
        try {
          const response = await fetch(`${USER_SERVICE}/users/${uid}`, {
            headers: {
              'x-user-id': myId,
              'x-user-role': req.headers['x-user-role'] || 'student',
            },
          });
          if (response.ok) {
            const data = await response.json();
            return data.user;
          }
          return { _id: uid, name: 'Unknown User' };
        } catch {
          return { _id: uid, name: 'Unknown User' };
        }
      })
    );

    res.status(200).json({ success: true, connections: enrichedConnections });
  } catch (err) {
    console.error(err);
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
    let connectionId = null;
    if (connection) {
      connectionId = connection._id;
      if (connection.status === 'pending')
        status = connection.requester.toString() === myId ? 'request_sent' : 'request_received';
      else if (connection.status === 'accepted') status = 'connected';
    }
    res.status(200).json({ success: true, status, connectionId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};