export const startConnectionConsumer = async (io, channel) => {
  const q = await channel.assertQueue('notify.connections', { durable: true });
  await channel.bindQueue(q.queue, 'alumni_events', 'connection.#');

  channel.consume(q.queue, (msg) => {
    if (!msg) return;
    const event    = JSON.parse(msg.content.toString());
    const key      = msg.fields.routingKey;

    if (key === 'connection.request') {
      io.to(event.recipientId).emit('new_notification', {
        type: 'connection_request',
        from: event.requesterId,
      });
    } else if (key === 'connection.accepted') {
      io.to(event.requesterId).emit('new_notification', {
        type: 'connection_accepted',
        by:   event.recipientId,
      });
    }

    channel.ack(msg);
  });
};