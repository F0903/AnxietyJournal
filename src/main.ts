import { app, BrowserWindow, ipcMain } from "electron";
import Database from "./db/journaldb";
import path from "path";
import { shell } from "electron";
import { version } from "../package.json";

let win: BrowserWindow;

app.on("ready", async () => {
	win = new BrowserWindow({
		title: `Anxiety Journal v${version}`,
		darkTheme: true,
		minHeight: 700,
		minWidth: 650,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	win.setMenuBarVisibility(false);
	await win.loadFile("./view/index.html");
	win.show();
});

app.on("window-all-closed", () => {
	if (process.platform == "darwin") return;
	app.quit();
});

ipcMain.handle("db-get", async (ev, args) => {
	const db = new Database();
	const colName = args[0];
	const query = args[1];
	const val = await db.getValue(colName, query);
	await db.close();
	return val;
});

ipcMain.handle("db-get-all", async (ev, args) => {
	const db = new Database();
	const colName = args[0];
	const query = args[1];
	const val = await db.getAll(colName, query);
	await db.close();
	return val;
});

ipcMain.on("db-set", async (ev, args) => {
	const db = new Database();
	const colName = args[0];
	const value = args[1];
	await db.setValue(colName, value);
	await db.close();
});

ipcMain.on("db-delete", async (ev, args) => {
	const db = new Database();
	const colName = args[0];
	const value = args[1];
	await db.deleteValue(colName, value);
	await db.close();
});

ipcMain.on("link-open", async (ev, args) => {
	const link = args[0];
	await shell.openExternal(link);
});
