import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Database from "./db/journaldb";
import path from "path";
import { homedir } from "os";
import { shell } from "electron";
import { version } from "../package.json";
import { exportToDirectory } from "./export/exporter";

let win: BrowserWindow;

app.on("ready", async () => {
	win = new BrowserWindow({
		title: `Anxiety Journal v${version}`,
		backgroundColor: "#1e1646",
		darkTheme: true,
		minHeight: 700,
		minWidth: 650,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js"),
		},
		show: false,
	});
	win.on("ready-to-show", () => win.show());
	win.setMenuBarVisibility(false);
	await win.loadFile(path.join(__dirname, "view/index.html"));
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

ipcMain.on("export-userselect", async (ev, args) => {
	const rowCols = args[0];
	const desktop = path.join(homedir(), "Desktop");
	const result = await dialog.showOpenDialog(win, {
		buttonLabel: "Select",
		defaultPath: desktop,
		properties: ["openDirectory"],
	});
	const dir = result.filePaths[0];
	exportToDirectory(rowCols, dir);
});
