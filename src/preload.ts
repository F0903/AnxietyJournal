import { contextBridge, ipcRenderer } from "electron";
import { FilterQuery } from "mongodb";
import { IDbDocument } from "./db/db";
import { IJournalDocument, JournalDocument } from "./db/journaldb";

declare global {
	interface Window {
		db: IDbApi;
		journal_db: IJournalDbApi;
	}
}

export interface IJournalDbApi {
	get_all: <Q>(
		colName: string,
		query: FilterQuery<Q>
	) => Promise<readonly JournalDocument[]>;

	set: (colName: string, value: IJournalDocument) => Promise<void>;
}

class JournalDbApi implements IJournalDbApi {
	get_all = <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<readonly JournalDocument[]> => {
		return send_receive("db-get-all", colName, query);
	};

	set = (colName: string, value: IJournalDocument): Promise<void> => {
		return send("db-set", colName, value);
	};
}

export interface IDbApi {
	get: <Q>(colName: string, query: FilterQuery<Q>) => Promise<IDbDocument | null>;
	get_all: <Q>(
		colName: string,
		query: FilterQuery<Q>
	) => Promise<readonly IDbDocument[]>;
	set: (colName: string, value: IDbDocument) => Promise<void>;
	delete: <Q>(colName: string, query: FilterQuery<Q>) => Promise<void>;
}

class DbApi implements IDbApi {
	get = async <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<IDbDocument | null> => {
		return send_receive("db-get", colName, query);
	};

	get_all = async <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<readonly IDbDocument[]> => {
		return send_receive("db-get-all", colName, query);
	};

	set = async (colName: string, value: IDbDocument): Promise<void> => {
		return send("db-set", colName, value);
	};

	delete = async <Q>(colName: string, query: FilterQuery<Q>): Promise<void> => {
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

contextBridge.exposeInMainWorld("db", new DbApi());
contextBridge.exposeInMainWorld("journal_db", new JournalDbApi());
