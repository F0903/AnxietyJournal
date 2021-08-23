import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Database from "./db/db";
import path from "path";
import { shell } from "electron";
import { version } from "../package.json";
import { exportToDirectory } from "./export/exporter";
import { getDesktopDir } from "./utils/path-util";
import { autoUpdater } from "electron-updater";

const isDev = !app.isPackaged;

let win: BrowserWindow; // Global handle to window so it doesn't get GC'ed

function update() {
	autoUpdater.checkForUpdatesAndNotify({
		title: "Anxiety Journal",
		body: "An update has been found. Installation will begin on exit.",
	});
}

app.on("ready", async () => {
	win = new BrowserWindow({
		title: `Anxiety Journal v${version}`,
		backgroundColor: "#1e1646",
		frame: false,
		darkTheme: true,
		minHeight: 700,
		minWidth: 700,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js"),
		},
		paintWhenInitiallyHidden: true,
		show: false,
	});
	win.on("ready-to-show", () => win.show());
	win.setMenuBarVisibility(false);
	await win.loadFile(path.join(__dirname, "view/index.html"));
	update();
});

app.on("window-all-closed", () => {
	if (process.platform == "darwin") return;
	app.quit();
});

ipcMain.on("app-close", () => {
	app.quit();
});

ipcMain.on("app-min", () => {
	win.minimize();
});

ipcMain.handle("app-toggle-max", () => {
	const isMax = win.isMaximized();
	if (isMax) win.unmaximize();
	else win.maximize();
	return !isMax;
});

ipcMain.handle("db-get", async (ev, args) => {
	return await Database.do(async (db) => {
		const colName = args[0];
		const query = args[1];
		const val = await db.getValue(colName, query);
		return val;
	});
});

ipcMain.handle("db-get-all", async (ev, args) => {
	return await Database.do(async (db) => {
		const colName = args[0];
		const query = args[1];
		const val = await db.getAll(colName, query);
		return val;
	});
});

ipcMain.on("db-set", async (ev, args) => {
	await Database.do(async (db) => {
		const colName = args[0];
		const value = args[1];
		await db.setValue(colName, value);
	});
});

ipcMain.on("db-delete", async (ev, args) => {
	await Database.do(async (db) => {
		const colName = args[0];
		const value = args[1];
		await db.deleteValue(colName, value);
	});
});

ipcMain.on("link-open", async (ev, args) => {
	const link = args[0];
	await shell.openExternal(link);
});

ipcMain.on("export-userselect", async (ev, args) => {
	const rowCols = args[0];
	const format = args[1];
	const desktop = getDesktopDir();
	const result = await dialog.showOpenDialog(win, {
		buttonLabel: "Select",
		defaultPath: desktop,
		properties: ["openDirectory"],
	});
	const dir = result.filePaths[0];
	exportToDirectory(rowCols, dir, format);
});
