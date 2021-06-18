import { resolve, join } from "path";
import { rmSync, writeFileSync } from "fs-extra";
import { GetDesktopDir } from "./path-util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createDesktopShortcut = require("create-desktop-shortcuts");

const appName = "Anxiety Journal.exe";
const path = resolve(__dirname, `../../../../${appName}`);

function debugWrite(content: string) {
	writeFileSync(join(GetDesktopDir(), "debug.txt"), content);
}

export function setupShortcuts(): void {
	debugWrite(path);
	createDesktopShortcut({
		windows: { filePath: path },
		linux: { filePath: path },
		osx: { filePath: path },
	});
	addToStartMenu();
}

export function removeShortcuts(): void {
	const file = join(GetDesktopDir(), appName);
	try {
		rmSync(file);
		removeFromStartMenu();
	} catch {
		return;
	}
}

function addToStartMenu() {
	createDesktopShortcut({
		windows: {
			filePath: path,
			outputPath: "%AppData%\\Microsoft\\Windows\\Start Menu\\Programs",
		},
		linux: {
			filePath: path,
			outputPath: "~/.local/share/applications",
		},
	});
}

function removeFromStartMenu() {
	const plat = process.platform;
	if (plat === "darwin") return;

	let path = "";
	if (plat === "win32") {
		const home = process.env.HOME;
		if (!home) throw new Error("HOME variable was undefined.");
		path = join(home, "Microsoft\\Windows\\Start Menu\\Programs\\", appName);
	} else if (plat === "linux") {
		path = join("~/.local/share/applications", appName);
	}
	rmSync(path);
}
