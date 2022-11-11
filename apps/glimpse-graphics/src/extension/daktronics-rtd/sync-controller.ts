import {replicants} from "../util/replicants";
import {MessageComposable} from "../util/MessageComposable";
import {SerialPortStream} from "@serialport/stream";
import {MockBinding, MockPortBinding} from "@serialport/binding-mock";
import {SerialPort} from "serialport";
import {daktronicsRtdListener} from "./protocol";
import {sports} from "./sports-definitions";
import {logger} from "../util/logger";

// Serial port instance that is currently open.
let port: SerialPortStream| null = null;

// Mock data input channel. If the open port is set to MOCK, then any data sent to this channel will be echoed to the
//   port.
const mockMessageChannel = new MessageComposable("mock", "glimpse-graphics.daktronics");
// Clients can send any data to this channel and the server will respond with the list of all sports and their packet definitions.
new MessageComposable("sports-request", "glimpse-graphics.daktronics").listen((argument, ack) => {
	ack(null, sports);
});

/**
 * Close the currently open serial port. If no serial port is open, then do nothing. Returns a promise that resolves
 *  when the port is closed.
 */
async function closeSerialPort(): Promise<void> {
	if(port && port.isOpen) {
		await new Promise(resolve => port?.close(resolve));
	}
	port = null;
	replicants.sync.status.value.connected = false;
}

/**
 * Open a Daktronics RTD serial port connection. If a port is already open, then it will be closed first.
 * @param path Path to the serial port to open. In Unix-like systems, this will be something like "/dev/ttyUSB0". In
 *  Windows, this will be something like "COM3". If the path is "MOCK", then a mock serial port will be opened instead.
 *  This is useful for testing without a physical serial port. Data can be passed to the mock port by sending it to the
 *  "glimpse-graphics.daktronics.mock" channel.
 * @param baudRate Baud rate to use when communicating with the serial port. This should almost certainly be 19200.
 */
async function openSerialPort(path: string, baudRate: number = 19200): Promise<void> {
	// If a port is already open, then close it.
	if(port && port.isOpen) {
		await closeSerialPort();
	}

	// Open the serial port.
	if(path === "MOCK") {
		// "MOCK" port is a special port which can take in any data and echo it back out.
		MockBinding.createPort('MockPort', {echo: true, record: true});
		port = new SerialPortStream({binding: MockBinding, path: 'MockPort', baudRate})
	} else {
		// Confirm that the serial port exists.
		if(!(await SerialPort.list()).some(port => port.path === path)) {
			throw new Error("Serial port does not exist.");
		}
		port = new SerialPort({path, baudRate});
	}

	// Whenever data is received by the port, send it out as a message so users can monitor the connection status.
	port.on('data', async (data) => {
		bitrateCalculationCache.push({timestamp: Date.now(), byteCount: data.length});
		await new MessageComposable("data", "glimpse-graphics.daktronics").send(data);
	});

	// Set up the Daktronics RTD listener on the port.
	port.on('data', daktronicsRtdListener);

	port.on('open', () => replicants.sync.status.value.connected = true);
	port.on('close', () => replicants.sync.status.value.connected = false);
}

// Calculate connection bitrate every second. This loop occurs even if the port is closed.
let bitrateCalculationCache: {timestamp: number, byteCount: number}[] = [];
replicants.sync.status.value = { connected: false, bitrate: 0 }
setInterval(() => {
	// Remove data older than 5 seconds.
	bitrateCalculationCache = bitrateCalculationCache.filter(c => c.timestamp > Date.now() - 5000);
	// Calculate total number of bytes received within our 5-second window.
	const byteCount = bitrateCalculationCache.reduce((a, b) => a + b.byteCount, 0);
	// Find the oldest timestamp in our 5-second window (probably close to 5 seconds, but may be less, especially if the
	//   port was just opened within the last 5 seconds).
	const oldestTimestamp = bitrateCalculationCache.reduce((a, b) => a < b.timestamp ? a : b.timestamp, Date.now());
	// Update bitrate to be total number of bits sent divided by the number of seconds since the oldest timestamp.
	replicants.sync.status.value.bitrate = Math.floor((byteCount / ((Date.now() - oldestTimestamp) / 1000)) * 8) || 0;
}, 1000);

// Update the list of available serial ports every second.
replicants.sync.availablePorts.value = [];
setInterval(async () => {
	replicants.sync.availablePorts.value = (await SerialPort.list()).map(p => p.path);
}, 1000);

// Attempt to connect to serial port every second if it's currently closed. This way, if the serial port is unplugged
//   and plugged back in, the server will automatically reconnect. Server will also auto connect with saved values on
//   startup.
setInterval(async () => {
	if(replicants.sync.selectedPort.value !== null && !port?.isOpen) {
		try {
			await openSerialPort(replicants.sync.selectedPort.value);
		} catch(ignored) {}
	}
}, 1000);

// Listen for changes to the selected serial port and open/close the port connection as needed.
replicants.sync.selectedPort.on('change', async (newSelectedPort) => {
	await closeSerialPort();
	if(!newSelectedPort) {
		return;
	}
	try {
		await openSerialPort(newSelectedPort);
	} catch(e) {
		logger.error(e, 'Failed to open serial port.');
	}
});

// Feed mock data to the serial port if the port is open and is a mock port
mockMessageChannel.listen((data) => {
	if (replicants.sync.selectedPort.value === "MOCK" && port && port.isOpen) {
		(<MockPortBinding>port.port).emitData(data)
	}
})

