export const startMessageConsumer = async (io, channel) => {
  const q = await channel.assertQueue('notify.messages', { durable: true });
  await channel.bindQueue(q.queue, 'alumni_events', 'message.sent');

  channel.consume(q.queue, (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());

    io.to(event.receiverId).emit('new_notification', {
      type:    'message',
      senderId: event.senderId,
      preview: event.content.substring(0, 50),
      at:      event.createdAt,
    });

    console.log(`[Notification] message.sent → notified ${event.receiverId}`);
    channel.ack(msg);
  });
};