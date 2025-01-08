import {unlink, readFile, readdirSync, statSync, unlinkSync} from "fs";
import { join, extname } from "path";
import * as fs from "fs";


const directories = [
	'node_modules',
	'shared/dist',
	'dashboard',
	'graphics',
	'extension'
];

function deleteFilesWithExtension(dir: string, extension: string) {
	readdirSync(dir).forEach(file => {
		const filePath = join(dir, file);

		if (statSync(filePath).isDirectory()) {
			deleteFilesWithExtension(filePath, extension);
		} else if (extname(file) === `.${extension}`) {
			unlinkSync(filePath);
		} else if (!extension) {
			unlinkSync(filePath);
		}
	});
}

directories.forEach(directory => {
	const dirPath = join(__dirname, directory);

	if (fs.existsSync(dirPath)) {
		if (directory === "node_modules") {
			console.log(`Searching for ".cache" files in ${directory}...`);
			deleteFilesWithExtension(dirPath, 'cache');
		}
		else {
			console.log(`Deleting all files in ${directory}...`);
			deleteFilesWithExtension(dirPath, "");
		}
		console.log(`Deleted all specified files in ${directory}...`);
	} else {
		console.log(`${directory} directory not found.`);
	}
});
