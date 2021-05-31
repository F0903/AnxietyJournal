import { contextBridge, ipcRenderer } from "electron";
import { FilterQuery } from "mongodb";
import { IJournalDocumentFrame } from "./db";

declare global {
	interface Window {
		api: IAPI;
	}
}

export interface IAPI {
	db_get: <T, Q>(colName: string, query: FilterQuery<Q>) => Promise<T | null>;
	db_get_all: <T, Q>(colName: string, query: FilterQuery<Q>) => Promise<T[]>;
	db_set: (colName: string, value: IJournalDocumentFrame) => Promise<void>;
	db_delete: <Q>(colName: string, query: FilterQuery<Q>) => Promise<void>;
}

class API implements IAPI {
	db_get = async <T, Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<T | null> => {
		return send_receive("db-get", colName, query);
	};

	db_get_all = async <T, Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<T[]> => {
		return send_receive("db-get-all", colName, query);
	};

	db_set = async (
		colName: string,
		value: IJournalDocumentFrame
	): Promise<void> => {
		send("db-set", colName, value);
	};

	db_delete = async <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<void> => {
		return send("db-delete", colName, query);
	};
}

const send_receive = <T>(channel: string, ...data: unknown[]): Promise<T> => {
	// REMEMBER TO WHITELIST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	const validChannels = ["db-get", "db-get-all"];
	if (!validChannels.includes(channel))
		throw `Window API was accessed with channel '${channel}', which is not whitelisted.`;
	return ipcRenderer.invoke(channel, data);
};

const send = (channel: string, ...data: unknown[]): Promise<void> => {
	// REMEMBER TO WHITELIST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	const validChannels = ["db-set", "db-delete"];
	if (!validChannels.includes(channel))
		throw `Window API was accessed with channel '${channel}', which is not whitelisted.`;
	ipcRenderer.send(channel, data);
	return Promise.resolve();
};

contextBridge.exposeInMainWorld("api", new API());
