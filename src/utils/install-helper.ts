import path from "path";
import { rmSync, writeFileSync, symlink } from "fs-extra";
import { GetDesktopDir } from "./path-util";

const appName = "Anxiety Journal.exe";
const appPath = path.resolve(__dirname, `../../../../${appName}`);

function debugWrite(content: string) {
	writeFileSync(path.join(GetDesktopDir(), "debug-ih.txt"), content);
}

export function setupShortcuts(): void {
	//TODO
	addToDesktop();
	addToStartMenu();
}

export function removeShortcuts(): void {
	//TODO
	const file = path.join(GetDesktopDir(), appName);
	rmSync(file);
	removeFromStartMenu();
}

function addToDesktop() {
	//TODO
}

function removeFromDesktop() {
	//TODO
}

function addToStartMenu() {
	//TODO
}

function removeFromStartMenu() {
	//TODO
	const plat = process.platform;
	if (plat === "darwin") return;

	let shortcutPath = "";
	if (plat === "win32") {
		const home = process.env.HOME;
		if (!home) throw new Error("HOME variable was undefined.");
		shortcutPath = path.win32.join(
			home,
			"Microsoft\\Windows\\Start Menu\\Programs\\",
			appName
		);
	} else if (plat === "linux") {
		shortcutPath = path.join("~/.local/share/applications", appName);
	}
	rmSync(shortcutPath);
}
