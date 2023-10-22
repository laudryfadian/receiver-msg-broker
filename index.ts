import * as amqp from 'amqplib';
import { sendEmail } from './sendMail';

(async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        process.once('SIGINT', () => {
            if (connection) connection.close();
        });

        const channel = await connection.createChannel();
        const queue = 'my_queue';

        await channel.assertQueue(queue, {
            exclusive: false,
            durable: true,
            autoDelete: false,
            arguments: {
                'x-queue-type': 'stream',  
                'x-max-length-bytes': 2_000_000_000 
            }
        });

        channel.prefetch(100);

        channel.consume(queue, (msg) => {
          if (msg) {
            const messageObject = JSON.parse(msg.content.toString());
            const to = messageObject.to;
            const subject = messageObject.subject;
            const text = messageObject.text;

            sendEmail(to, subject, text);

            console.log(" [x] Received '%s'", msg.content.toString());
            channel.ack(msg); 
          }
        }, {
          noAck: false,
          arguments: {
            'x-stream-offset': 'first'
          }
        });

        console.log(' [*] Waiting for messages. To exit press CTRL+C');
    } catch(e) {
        console.error(e);
    }
})();
