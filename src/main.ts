import { app, BrowserWindow, ipcMain, dialog, autoUpdater } from "electron";
import Database from "./db/journaldb";
import path from "path";
import { shell } from "electron";
import { version } from "../package.json";
import { exportToDirectory } from "./export/exporter";
import { getDesktopDir } from "./utils/path-util";
import { setupShortcuts, removeShortcuts } from "./utils/install-helper";

//TODO: Improve app startup time.

const squirrelUrl = "http://localhost:3333";

let win: BrowserWindow;

function autoUpdate() {
	autoUpdater.setFeedURL({ url: `${squirrelUrl}/win64/` });

	autoUpdater.addListener("checking-for-update", () =>
		console.log("Checking for updates...")
	);

	autoUpdater.addListener("update-available", () =>
		console.log("Found available update")
	);

	autoUpdater.addListener("update-downloaded", (ev, relNotes, relName) => {
		console.log(`Downloaded update ${relName}`);
	});
}

function handleSquirrelStartupEvent() {
	if (process.platform !== "win32") return false;
	const squirrelCmd = process.argv[1];
	switch (squirrelCmd) {
		case "--squirrel-firstrun":
			setupShortcuts();
			return false; // Don't exit on first run.

		case "--squirrel-install":
		case "--squirrel-updated":
			// Insert things to when updated.
			return true;

		case "--squirrel-uninstall":
			removeShortcuts();
			return true;

		case "--squirrel-obsolete":
			// This gets called on the outgoing version of the app.
			return true;
	}
}

if (handleSquirrelStartupEvent()) app.quit();

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
	if (process.env.NODE_ENV !== "dev") autoUpdate();
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
