import amqplib from 'amqplib';

let channel = null;

export const connectBroker = async () => {
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await conn.createChannel();
    await channel.assertExchange('alumni_events', 'topic', { durable: true });
    console.log('RabbitMQ connected (event publisher)');
  } catch (err) {
    console.warn('⚠️ RabbitMQ not available (event-service):', err.message);
    channel = null;
  }
};

export const publishEvent = async (routingKey, payload) => {
  if (!channel) {
    console.warn('⚠️ RabbitMQ not connected, skipping publish:', routingKey);
    return;
  }
  channel.publish(
    'alumni_events',
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
};