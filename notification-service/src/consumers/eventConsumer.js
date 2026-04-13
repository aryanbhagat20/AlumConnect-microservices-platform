export const startEventConsumer = async (io, channel) => {
  const q = await channel.assertQueue('notify.events', { durable: true });
  await channel.bindQueue(q.queue, 'alumni_events', 'event.created');

  channel.consume(q.queue, (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());

    // Broadcast to ALL connected users about the new event
    io.emit('new_notification', {
      type:     'new_event',
      title:    event.title,
      eventId:  event.eventId,
      audience: event.audience,
    });

    console.log(`[Notification] event.created → broadcast to all`);
    channel.ack(msg);
  });
};