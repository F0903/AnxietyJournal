import { ipcRenderer } from "electron";

const permitted_channels = [
	"link-open",
	"db-get",
	"db-get-all",
	"db-set",
	"db-delete",
];

async function throwOnBlacklist(channel: string) {
	if (!permitted_channels.includes(channel))
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
