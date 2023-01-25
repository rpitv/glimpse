import {sports} from "./sports-definitions";
import {replicants} from "../util/replicants";
import {logger} from "../util/logger";
import * as fs from 'fs-extra';
import * as path from "path";

const packetBytes: number[] = [];
let computedChecksum = 0;

/*
DAKTRONICS RTD PROTOCOL

--- Overview ---
The RTD protocol is a packet-based protocol over an RS-232 serial connection with a baud rate of 19200. The start of a
new packet is indicated by a 0x16 byte. The end of a packet is indicated by a 0x17 byte. Each packet has a checksum as
the last two bytes, which is the sum of all bytes in the packet (not including the checksum bytes), modulo 256, and
then encoded as two ASCII characters.

As an example, consider the following packet (in hexadecimal):

16303030 30303030 30013030 34323130
30303133 0220353A 32312035 3A323120
20202020 20202020 20202020 20202020
353A3231 3A353504 454317

- Byte 0: Start of packet (0x16)
- Bytes 2-56: Data payload (0x30...0x04)
- Bytes 57-58: Checksum. Sum of bytes 2-56, modulo 256, and encoded as ASCII (0x45 0x43)
- Byte 59: End of packet (0x17)

--- Payload ---


 */

/**
 * Convert a Buffer to a pretty-printed string of bytes in hexadecimal, where there is a space between each byte (i.e.,
 *  there is a space between each pair of characters).
 * @param data The Buffer to convert.
 * @returns The pretty-printed string.
 */
function bufferToHexString(data: Buffer) {
	const hexDataStr = data.toString('hex').toUpperCase();
	// Add spaces between each byte
	return hexDataStr.match(/.{1,2}/g)?.join(' ') ?? '';
}

const dumpQueue: (() => Promise<void>)[] = [];
/**
 * Write an incoming data buffer to the dump file. This is useful for debugging and is enabled by default,
 *  but can be disabled by setting the DUMP_RTD environment variable to "false". Data is written in
 *  the order it is received. Note that it always writes data to a file corresponding to the current
 *  date. If the program is running at midnight, a packet could be split across two files.
 *
 *  Data is written to the "dumps" directory, with the name "Daktronics_<year>_<month>_<day>.dump". The
 *  file and directory are created if they don't exist. If the write/creation fails, a debug is logged,
 *  and no errors are thrown.
 * @param data Incoming data buffer.
 */
async function writeToDumpFile(data: Buffer): Promise<void> {
	const date = new Date();
	const fileName = `Daktronics_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}.dump`
	const directory = path.join(__dirname, '..', '..', 'dumps');
	const filePath = path.join(directory, fileName);

	const dumpFn = async () => {
		try {
			await fs.ensureFile(filePath);
			await fs.appendFile(filePath, data);
		} catch(err) {
			logger.debug({error: err, data: bufferToHexString(data)},
				`failed to write buffer to dump file ${filePath}`);
		}
	}

	// To ensure that data is written in the correct order, we need to wait for the previous write to finish before
	//  writing the next one. This may not be necessary due to the way the event loop functions, but it's better to be
	//  safe than sorry for now.
	dumpQueue.push(dumpFn);

	// If this is the only dump queued up, then we can start writing it. We will then handle any
	//  additional dumps that have been queued up.
	if(dumpQueue.length === 1) {
		while(dumpQueue[0] !== undefined) {
			await dumpQueue[0]();
			dumpQueue.shift();
		}
	}
}

/**
 * Handler for incoming data on a Daktronics RTD serial port. This function handles the raw data coming in from
 *   the serial port and parses it into packets. It then verifies the packets' checksums and passes them to the
 *   packet handler {@link handlePacket}.
 * @param data Buffer containing the incoming data. This may contain multiple packets, or only part of a packet.
 *   Packets are delineated by a 0x16 byte at the start and a 0x17 byte at the end. Once a packet is completed, its
 *   checksum is verified, and if it is valid, it is passed to the packet handler
 *   {@link handlePacket}.
 */
export function daktronicsRtdListener(data: Buffer) {
	replicants.sync.status.value.error = false;

	if(logger.isLevelEnabled("trace")) {
		logger.trace({rawBytes: bufferToHexString(data)},'Received data from serial port');
	}

	// dumping the Daktronics serial connection to a dump file
	if(process.env.DUMP_RTD !== "false") {
		writeToDumpFile(data);
	}

	for(const byte of data) {
		if(byte === 0x16) {
			// Start of a new packet. Clear the packet buffer and reset the checksum.
			logger.trace('Byte 0x16 received, starting new packet by clearing packet buffer');
			packetBytes.length = 0;
			computedChecksum = 0;
		} else if(byte === 0x17) {
			logger.trace('Byte 0x17 received, attempting to parse data in packet buffer');
			// Every packet+checksum must be at least 2 bytes long, as that's the length of the checksum.
			if(packetBytes.length < 2) {
				logger.warn('Received a packet with a length of %d. Minimum length ' +
					'is 2, not including the start and end bytes. Packet ignored.', packetBytes.length);
				continue;
			}

			logger.trace('Pulling checksum bytes from the end of the packet buffer');
			const checksumBytes = packetBytes.slice(-2);
			// Subtract the checksum bytes from the computed checksum. We didn't know they were checksum bytes when we
			//   added them. Also remove the bytes from the array of packet bytes.
			computedChecksum -= checksumBytes[0] + checksumBytes[1];
			packetBytes.length -= 2;

			// Last two bytes are the checksum in hexadecimal encoded as ASCII characters. E.g., if the checksum
			//   is 0xEC, then the value of the last two bytes will be 0x4543.
			logger.trace({
				checksumBytes
			},'Verifying checksum');
			const checksumBuffer = Buffer.from(Buffer.from(checksumBytes).toString('ascii'), 'hex');
			if(checksumBuffer.length !== 1) {
				logger.warn('Computed checksum buffer has a length of %d. Expected length is 1. Packet ignored.', checksumBuffer.length);
				continue;
			}

			if((computedChecksum % 256) !== checksumBuffer.readUInt8()) {
				logger.warn(
					{
						received: checksumBuffer.readUInt8().toString(16),
						computed: (computedChecksum % 256).toString(16)
					},
					'Received a packet with an invalid checksum. Packet ignored.'
				);
				continue;
			}

			// At this point, packetBytes contains only the actual packet data.
			//   0x16, 0x17, and checksum bytes aren't included.
			logger.trace('Checksum verified, passing packet to packet handler');
			handlePacket(Buffer.from(packetBytes));
		} else {
			// Add the byte to the packet buffer and add it to the checksum.
			logger.trace('Adding byte 0x%s to packet buffer and checksum', byte.toString(16).padStart(2, '0'));
			packetBytes.push(byte);
			computedChecksum += byte;
		}
	}
}

const packetFrequencies: {[key: number]: number} = {};
function handlePacket(packet: Buffer): void {
	// If selected sport is undefined or isn't in the sports list, then we don't know how to parse the packet.
	if(!replicants.sync.selectedSport.value || !sports[replicants.sync.selectedSport.value]) {
		logger.trace('Selected sport is undefined or not in the sports list. Unsure of how to handle packet.');
		return;
	}

	// Strip all bytes up to 0x01. Seems to be padding.
	logger.trace('Stripping all bytes up to 0x01');
	const paddingStrippedData = packet.slice(packet.indexOf(0x01) + 1);

	// Get the ID. IDs are in the form "00421xxxxx", where "xxxxx" is the ID, all in ASCII. Add one, since it's zero-indexed
	logger.trace('Getting the ID of the packet');
	const id = parseInt(paddingStrippedData.slice(5, 10).toString('ascii'), 10) + 1;

	packetFrequencies[id] = (packetFrequencies[id] || 0) + 1;

	// Make sure this is a valid packet for this sport.
	if(!sports[replicants.sync.selectedSport.value][id]) {
		logger.trace('Packet ID %d is not valid for the selected sport. Ignoring packet.', id);
		return;
	}

	// Get the length of the relevant data for this packet for the given sport.
	const dataLength = sports[replicants.sync.selectedSport.value][id].length

	// Pull the relevant data out of the packet.
	logger.trace('Packet ID %d has an expected length of %d bytes. Pulling data from packet.', id, dataLength);
	const data = paddingStrippedData.slice(11, 11 + dataLength).toString('ascii');
	const trimmedData = data.trim();

	if(logger.isLevelEnabled("debug")) {
		logger.debug({
			id,
			fullMessageBlock: paddingStrippedData.toString('ascii'),
			messageLength: dataLength,
			messageBlock: data,
			trimmedMessageBlock: trimmedData
		},'Packet parsed, being passed to handler');
	}

	// Call the handler for the packet, if it is defined.
	const handler = sports[replicants.sync.selectedSport.value][id].handler;
	if(!handler) {
		logger.debug('No handler defined for packet ID %d. Ignoring packet.', id);
		return;
	}
	handler(trimmedData);
}

if(logger.isLevelEnabled("debug")) {
	setInterval(() => {
		logger.debug({
			packetFrequencies
		}, 'Packet frequencies');
	}, 10000);
}
