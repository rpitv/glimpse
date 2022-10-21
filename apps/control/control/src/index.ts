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

    if (process.env.DEBUG) {
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

    let procStopped = false;
    let procRespawnTries = 0;
    let procRespawnTriesResetTimeout: NodeJS.Timeout | null = null;

    // Continue to respawn the process until it's stopped manually or it's been attempted to respawn
    //   for an hour with no success. (See below for logic behind 450)
    while (!procStopped && procRespawnTries < 450) {
        channel.publish(
            STATE_EXCHANGE_NAME,
            "",
            Buffer.from(
                JSON.stringify({
                    id,
                    to,
                    from,
                    message: `[try ${procRespawnTries}] Starting stream...`,
                })
            )
        );

        // Add a delay before trying to (re)start the stream
        await new Promise((resolve) => {
            // First try (or first retry), no delay.
            if (procRespawnTries === 0) {
                resolve(undefined);
                return;
            }
            if (procRespawnTries < 29) {
                // Second retry thru 3 seconds, 1/10th of a second delay.
                setTimeout(resolve, 100);
            } else if (procRespawnTries < 150) {
                // 3 seconds thru 2 minutes, 1-second delay.
                setTimeout(resolve, 1000);
            } else {
                // 2 minutes and beyond, 5-second delay.
                setTimeout(resolve, 5000);
            }
        });
        procRespawnTries++;

        /*
        ffmpeg -re -i <source> \
        -c:v libx264 -preset veryfast -maxrate 6000k \
        -bufsize 12000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 \
        -ar 44100 -f flv -flvflags no_duration_filesize <destination>
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
            "-flvflags",
            "no_duration_filesize",
            to,
        ]);

        // Setup and maintain timer to reset procRespawnTries if a stream is running for more than
        //   10 seconds.
        if (procRespawnTriesResetTimeout !== null) {
            clearTimeout(procRespawnTriesResetTimeout);
        }
        procRespawnTriesResetTimeout = setTimeout(() => {
            procRespawnTries = 0;
        }, 10000);

        // Incoming messages from users managing the stream
        await channel.consume(exclusiveQueueName, async (rmqMessage) => {
            if (!rmqMessage) {
                return; // TODO throw error
            }

            const message = rmqMessage.content.toString();

            if (process.env.DEBUG) {
                console.log(`Received message ${message} for stream ${id}`);
            }

            if (message === "stop") {
                procStopped = true;
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

        // Send out ffmpeg informational output to the users
        proc.stderr.on("data", (data) => {
            if (process.env.DEBUG) {
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

        // Wait for this ffmpeg process to quit
        await new Promise((resolve) => proc.on("close", resolve));
    }

    // We've exited the while loop, stream is actually stopped now and will not restart.
    if (process.env.DEBUG) {
        console.log("[" + id + "] Stream closed");
    }

    // Error message if stream wasn't manually stopped
    if (!procStopped) {
        channel.publish(
            STATE_EXCHANGE_NAME,
            "",
            Buffer.from(
                JSON.stringify({
                    id,
                    to,
                    from,
                    message: "Upstream source disconnected",
                })
            )
        );
    }

    await channel.close();
    await client.close();
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

            if (process.env.DEBUG) {
                console.log("Received message", message);
            }

            if (!message.from || !message.to) {
                channel.ack(rmqMessage);
                return; // TODO throw error
            }

            startStream(message.from, message.to);
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
