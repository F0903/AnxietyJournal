import { contextBridge } from "electron";
import { AppApi, IAppApi } from "./window-api/app-api";
import { IDbApi, DbApi } from "./window-api/db-api";
import { ExportApi, IExportApi } from "./window-api/export-api";
import { IJournalDbApi, JournalDbApi } from "./window-api/journaldb-api";
import { ILinkApi, LinkApi } from "./window-api/link-api";

declare global {
	interface Window {
		app: IAppApi;
		db: IDbApi;
		export: IExportApi;
		journal_db: IJournalDbApi;
		link: ILinkApi;
	}
}

contextBridge.exposeInMainWorld("app", new AppApi());
contextBridge.exposeInMainWorld("db", new DbApi());
contextBridge.exposeInMainWorld("export", new ExportApi());
contextBridge.exposeInMainWorld("journal_db", new JournalDbApi());
contextBridge.exposeInMainWorld("link", new LinkApi());
