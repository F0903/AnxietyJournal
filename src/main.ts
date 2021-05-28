import { app, BrowserWindow } from "electron";
import path from "path";

let win: BrowserWindow;

app.on("ready", async () => {
	win = new BrowserWindow({
		title: "Anxiety Noter",
		darkTheme: true,
		minHeight: 600,
		minWidth: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.setMenuBarVisibility(false);
	await win.loadFile("index.html");
	win.show();
});

app.on("window-all-closed", () => {
	if (process.platform == "darwin") return;
	app.quit();
});
