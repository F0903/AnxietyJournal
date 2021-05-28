"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let win;
electron_1.app.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    win = new electron_1.BrowserWindow({
        title: "Anxiety Noter",
        darkTheme: true,
        minHeight: 600,
        minWidth: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path_1.default.join(__dirname, "preload.js"),
        },
    });
    win.setMenuBarVisibility(false);
    yield win.loadFile("index.html");
    win.show();
}));
electron_1.app.on("window-all-closed", () => {
    if (process.platform == "darwin")
        return;
    electron_1.app.quit();
});
//# sourceMappingURL=main.js.map