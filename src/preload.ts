import { contextBridge } from "electron";
import { IDbApi, DbApi } from "./window-api/db-api";
import { IJournalDbApi, JournalDbApi } from "./window-api/journaldb-api";
import { ILinkApi, LinkApi } from "./window-api/link-api";

declare global {
	interface Window {
		db: IDbApi;
		journal_db: IJournalDbApi;
		link: ILinkApi;
	}
}

contextBridge.exposeInMainWorld("db", new DbApi());
contextBridge.exposeInMainWorld("journal_db", new JournalDbApi());
contextBridge.exposeInMainWorld("link", new LinkApi());
