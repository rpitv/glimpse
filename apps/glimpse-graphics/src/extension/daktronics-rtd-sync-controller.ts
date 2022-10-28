import {replicants} from "./util/replicants";
import {MessageComposable} from "./util/MessageComposable";
import {SerialPortStream} from "@serialport/stream";
import {MockBinding, MockPortBinding} from "@serialport/binding-mock";
import {SerialPort} from "serialport";
import {daktronicsRtdListener} from "./daktronics-rtd-sync";

function setupSerialPort(newValue?: {path: string, baudRate: number, mock: boolean}|null, oldValue?:{path: string, baudRate: number, mock: boolean}|null): void {
	// If a port is already open, then close it.
	if(oldValue && port && port.isOpen) {
		port.close();
		replicants.sync.status.value.connected = false;
	}

	// Create/open the new port with the provided settings.
	if(newValue) {
		// FIXME: is there a security risk here? Limit scope of what files can be read from? Limits on baud rate?
		if(newValue.mock) {
			MockBinding.createPort(newValue.path, {echo: true, record: true});
			port = new SerialPortStream({binding: MockBinding, path: newValue.path, baudRate: newValue.baudRate})
		} else {
			port = new SerialPort({path: newValue.path, baudRate: newValue.baudRate});
		}

		// Whenever data is received by the port, send it out as a message so users can monitor the connection status.
		port.on('data', async (data) => {
			bitrateCalculationCache.push({timestamp: Date.now(), byteCount: data.length});
			await new MessageComposable("data", "glimpse-graphics.daktronics").send(data);
		});

		// Setup the Daktronics RTD listener on the port.
		port.on('data', daktronicsRtdListener);

		port.on('open', () => replicants.sync.status.value.connected = true);
		port.on('close', () => replicants.sync.status.value.connected = false);
	}
}

const mockMessageChannel = new MessageComposable("mock", "glimpse-graphics.daktronics");

let port: SerialPortStream| null = null;
let bitrateCalculationCache: {timestamp: number, byteCount: number}[] = [];
setInterval(() => {
	bitrateCalculationCache = bitrateCalculationCache.filter(c => c.timestamp > Date.now() - 5000);
	const byteCount = bitrateCalculationCache.reduce((a, b) => a + b.byteCount, 0);
	const oldestTimestamp = bitrateCalculationCache.reduce((a, b) => a < b.timestamp ? a : b.timestamp, Date.now());
	replicants.sync.status.value.bitrate = Math.floor((byteCount / ((Date.now() - oldestTimestamp) / 1000)) * 8) || 0;
}, 1000);

replicants.sync.status.value = { connected: false, bitrate: 0 }

// Set up the serial port connection when the server boots
setupSerialPort(replicants.sync.settings.value);
// Listen for changes to the serial port settings and open/close the port connection as needed.
replicants.sync.settings.on('change', (newValue, oldValue) => {
	if(!newValue || !newValue.path || !newValue.baudRate) {
		setupSerialPort(null, oldValue);
	}
	setupSerialPort(newValue, oldValue);
});

// Feed mock data to the serial port if the port is open and is a mock port
mockMessageChannel.listen((data) => {
	if (replicants.sync.settings.value?.mock && port && port.isOpen) {
		(<MockPortBinding>port.port).emitData(data)
	}
})

