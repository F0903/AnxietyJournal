import path from "path";
import { spawn } from "child_process";

const appName = "Anxiety Journal.exe";
const updaterPath = path.resolve(__dirname, "../../../../Update.exe");

export function setupShortcuts(): void {
	runUpdater(["--createShortcut", appName]);
}

export function removeShortcuts(): void {
	runUpdater(["--removeShortcut", appName]);
}

function runUpdater(args: readonly string[]) {
	spawn(updaterPath, args);
}
