import { homedir } from "os";
import path from "path";

export function GetDesktopDir(): string {
	return path.join(homedir(), "Desktop");
}
