import { ipcRenderer } from "electron";
import fs from "fs-extra";
import path from "path";

const permitted_channels: Set<string> = new Set();
let init = false;

// Dynamically get whitelists from adjacent api files.
async function initWhitelist() {
	const dir = path.dirname(__filename);
	const files = await fs.readdir(dir);
	for (const file of files) {
		if (path.extname(file) !== ".js") continue;
		if (file === path.basename(__filename)) continue;
		const { whitelist } = await import(path.join(dir, file));
		(whitelist as string[]).forEach((val) => permitted_channels.add(val));
	}
	init = true;
}

async function throwOnBlacklist(channel: string) {
	if (!init) await initWhitelist();
	if (!permitted_channels.has(channel))
		throw `Window API was accessed with channel '${channel}', which is not whitelisted.`;
}

export const send_receive = async <T>(
	channel: string,
	...data: unknown[]
): Promise<T> => {
	await throwOnBlacklist(channel);
	return ipcRenderer.invoke(channel, data);
};

export const send = async (
	channel: string,
	...data: unknown[]
): Promise<void> => {
	await throwOnBlacklist(channel);
	ipcRenderer.send(channel, data);
};
