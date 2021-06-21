import { homedir } from "os";
import path from "path";

export function getDesktopDir(): string {
	return path.join(homedir(), "Desktop");
}

export function getMenuDir(): string {
	const platform = process.platform;
	switch (platform) {
		case "win32": {
			const home = process.env.HOME;
			if (!home) throw new Error("HOME variable was undefined.");
			return path.join(home, "Microsoft\\Windows\\Start Menu\\Programs\\");
		}

		case "linux": {
			return "~/.local/share/applications";
		}

		default:
			throw Error("MenuDir was requested for an unsupported platform.");
	}
}

export function changeExtension(file: string, extension: string): string {
	const basename = path.basename(file, path.extname(file));
	return path.join(path.dirname(file), basename + extension);
}
