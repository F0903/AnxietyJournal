import { resolve } from "path";
import { rm } from "fs-extra";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createDesktopShortcut = require("create-desktop-shortcuts");

const path = resolve(__dirname, "");

function setupShortcut(): void {
	createDesktopShortcut({ windows: { filePath: path } });
}

function removeShortcut(): void {
	rm(path);
}
