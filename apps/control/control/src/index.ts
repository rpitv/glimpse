import { connect } from "amqplib";
import { v4 } from "uuid";
import { spawn } from "child_process";

if (!process.env.RABBITMQ_URL) {
  throw new Error("RABBITMQ_URL environment variable not set");
}

/*
Queue accepts the following types of message:
- {
    from: string, // RTMP source
    to: string // RTMP destination
  }
 */
const START_QUEUE_NAME = "video:control:start";
/*
State exchange will emit the following type of message:
- {
    id: string, // UUID of the stream. Private queue to control this stream will be video:control:<id>
    to: string, // RTMP destination
    from: string, // RTMP source
    message: string, // Message to display
  }
 */
const STATE_EXCHANGE_NAME = "video:state";

/**
 * Start a stream from RTMP source to RTMP destination
 * @param from RTMP source
 * @param to RTMP destination
 */
async function startStream(from: string, to: string): Promise<void> {
  // Unique ID for this stream
  const id = v4();

  if(process.env.DEBUG) {
    console.log(`Starting stream ${id} from ${from} to ${to}`);
  }

  // Create a new rabbitMQ connection so that when the stream ends, we can close the connection and delete
  //   exclusive queues.
  const exclusiveQueueName = "video:control:" + id;
  const client = await connect(<string>process.env.RABBITMQ_URL);
  const channel = await client.createChannel();
  await channel.assertExchange(STATE_EXCHANGE_NAME, "fanout", {
    durable: true,
  });
  await channel.assertQueue(exclusiveQueueName, { exclusive: true });

  /*
ffmpeg -re -i <source> \
-c:v libx264 -preset veryfast -maxrate 6000k \
-bufsize 12000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 \
-ar 44100 -f flv <destination>
 */
  const proc = spawn("ffmpeg", [
    "-re",
    "-i",
    from,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-maxrate",
    "6000k",
    "-bufsize",
    "12000k",
    "-pix_fmt",
    "yuv420p",
    "-g",
    "50",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-ac",
    "2",
    "-ar",
    "44100",
    "-f",
    "flv",
    to,
  ]);

  await channel.consume(exclusiveQueueName, async (rmqMessage) => {
    if (!rmqMessage) {
      return; // TODO throw error
    }

    const message = rmqMessage.content.toString();

    if(process.env.DEBUG) {
      console.log(`Received message ${message} for stream ${id}`);
    }

    if (message === "stop") {
      channel.publish(
        STATE_EXCHANGE_NAME,
        "",
        Buffer.from(
          JSON.stringify({
            id,
            to,
            from,
            message: "Stream stopping peacefully",
          })
        )
      );
      proc.kill();
    }
  });

  proc.stderr.on("data", (data) => {
    if(process.env.DEBUG) {
      console.log("[", id, "] ", data.toString());
    }
    channel.publish(
      STATE_EXCHANGE_NAME,
      "",
      Buffer.from(
        JSON.stringify({
          id,
          to,
          from,
          message: data.toString(),
        })
      )
    );
  });

  proc.on("close", async () => {
    if(process.env.DEBUG) {
        console.log('[' + id + '] Stream closed');
    }
    await channel.close();
    await client.close();
  });
}

async function start(): Promise<void> {
  // Listen for requests to start a stream
  const client = await connect(<string>process.env.RABBITMQ_URL);
  const channel = await client.createChannel();
  await channel.assertQueue(START_QUEUE_NAME, { durable: true });

  await channel.consume(
    START_QUEUE_NAME,
    async (rmqMessage) => {
      if (!rmqMessage) {
        return; // TODO throw error
      }

      const message = JSON.parse(rmqMessage.content.toString());

      if(process.env.DEBUG) {
        console.log('Received message', message);
      }

      if (!message.from || !message.to) {
        channel.ack(rmqMessage);
        return; // TODO throw error
      }

      await startStream(message.from, message.to);
      channel.ack(rmqMessage);
    },
    {
      noAck: false, // Manual acknowledgement
    }
  );
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
