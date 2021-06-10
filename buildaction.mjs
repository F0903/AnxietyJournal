import fs from "fs-extra";
import glob from "glob";
import path from "path";

const outDir = "./out/";

const filesToCopy = ["./package.json", "./src/view/set-exports.js"];

async function CopyToOut(file) {
	const fName = path.basename(file);
	const fDir = path.dirname(file); //.replace("src", "");

	const dest = path.join(outDir, fDir, fName);
	await fs.copy(file, dest);
}

glob("src/**/*.html", (err, files) => {
	if (err) throw err;
	files.forEach(CopyToOut);
});

glob("src/**/*.css", (err, files) => {
	if (err) throw err;
	files.forEach(CopyToOut);
});

filesToCopy.forEach(CopyToOut);
