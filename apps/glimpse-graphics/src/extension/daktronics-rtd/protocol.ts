import {sports} from "./sports-definitions";
import {replicants} from "../util/replicants";

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
 * Handler for incoming data on a Daktronics RTD serial port. This function handles the raw data coming in from
 *   the serial port and parses it into packets. It then verifies the packets' checksums and passes them to the
 *   packet handler {@link handlePacket}.
 * @param data Buffer containing the incoming data. This may contain multiple packets, or only part of a packet.
 *   Packets are delineated by a 0x16 byte at the start and a 0x17 byte at the end. Once a packet is completed, its
 *   checksum is verified, and if it is valid, it is passed to the packet handler
 *   {@link handlePacket}.
 */
export function daktronicsRtdListener(data: Buffer) {
	if(process.env.DEBUG) {
		console.log(data);
	}

	for(const byte of data) {
		if(byte === 0x16) {
			// Start of a new packet. Clear the packet buffer and reset the checksum.
			packetBytes.length = 0;
			computedChecksum = 0;
		} else if(byte === 0x17) {
			// Every packet+checksum must be at least 2 bytes long, as that's the length of the checksum.
			if(packetBytes.length < 2) {
				console.warn(new Error('Packet too short'));
			}

			const checksumBytes = packetBytes.slice(-2);
			// Subtract the checksum bytes from the computed checksum. We didn't know they were checksum bytes when we
			//   added them. Also remove the bytes from the array of packet bytes.
			computedChecksum -= checksumBytes[0] + checksumBytes[1];
			packetBytes.length -= 2;

			// let prettyPrintBytes = '';
			// for(const byte of data) {
			// 	prettyPrintBytes += byte.toString(16).padStart(2, '0') + ' ';
			// }
			// console.log(prettyPrintBytes)

			// Last two bytes are the checksum in hexadecimal encoded as ASCII characters. E.g., if the checksum
			//   is 0xEC, then the value of the last two bytes will be 0x4543.
			const checksumBuffer = Buffer.from(Buffer.from(checksumBytes).toString('ascii'), 'hex');
			if((computedChecksum % 256) !== checksumBuffer.readUInt8()) {
				console.warn(new Error(`Packet checksum failed. Received: ${checksumBuffer.readUInt8().toString(16)}, computed: ${(computedChecksum % 256).toString(16)}`));
				continue;
			}

			// At this point, packetBytes contains only the actual packet data.
			//   0x16, 0x17, and checksum bytes aren't included.
			handlePacket(Buffer.from(packetBytes));
		} else {
			// Add the byte to the packet buffer and add it to the checksum.
			packetBytes.push(byte);
			computedChecksum += byte;
		}
	}
}

function handlePacket(packet: Buffer): void {
	// If selected sport is undefined or isn't in the sports list, then we don't know how to parse the packet.
	if(!replicants.sync.selectedSport.value || !sports[replicants.sync.selectedSport.value]) {
		return;
	}

	console.log(packet);

	// Strip all bytes up to 0x01. Seems to be padding.
	const paddingStrippedData = packet.slice(packet.indexOf(0x01) + 1);
	// Get the ID. IDs are in the form "00421xxxxx", where "xxxxx" is the ID, all in ASCII. Add one, since it's zero-indexed
	const id = parseInt(paddingStrippedData.slice(5, 10).toString('ascii'), 10) + 1;
	console.log(id);

	// Make sure this is a valid packet for this sport.
	if(!sports[replicants.sync.selectedSport.value][id]) {
		return;
	}

	// Get the length of the relevant data for this packet for the given sport.
	const dataLength = sports[replicants.sync.selectedSport.value][id].length

	// Pull the relevant data out of the packet.
	const data = paddingStrippedData.slice(11, 11 + dataLength).toString('ascii');

	// Call the handler for the packet, if it is defined.
	const handler = sports[replicants.sync.selectedSport.value][id].handler;
	if(handler === undefined) {
		return;
	}
	handler(data);
}
