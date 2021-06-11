import { contextBridge } from "electron";
import { IDbApi, DbApi } from "./window-api/db-api";
import { IJournalDbApi, JournalDbApi } from "./window-api/journaldb-api";

declare global {
	interface Window {
		db: IDbApi;
		journal_db: IJournalDbApi;
	}
}

contextBridge.exposeInMainWorld("db", new DbApi());
contextBridge.exposeInMainWorld("journal_db", new JournalDbApi());
