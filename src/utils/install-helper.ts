import { resolve, join } from "path";
import { rmSync } from "fs-extra";
import { GetDesktopDir } from "./path-util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createDesktopShortcut = require("create-desktop-shortcuts");

const appName = "Anxiety Journal.exe";
const path = resolve(__dirname, `../../../../../${appName}`);

export function setupShortcut(): void {
	createDesktopShortcut({
		windows: { filePath: path },
		linux: { filePath: path },
		mac: { filePath: path },
	});
}

export function removeShortcut(): void {
	const file = join(GetDesktopDir(), appName);
	rmSync(file);
}
