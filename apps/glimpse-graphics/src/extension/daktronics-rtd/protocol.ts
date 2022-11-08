import {sports} from "./sports-definitions";
import {replicants} from "../util/replicants";
import {logger} from "../util/logger";

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
	if(logger.isLevelEnabled("trace")) {
		logger.trace({rawBytes: bufferToHexString(data)},'Received data from serial port');
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
		logger.trace('No handler defined for packet ID %d. Ignoring packet.', id);
		return;
	}
	handler(trimmedData);
}
