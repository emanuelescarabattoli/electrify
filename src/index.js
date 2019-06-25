const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// Menu.setApplicationMenu(null);

app.on("ready", () => {
    const window = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    });
    window.loadFile(path.join(__dirname, "index.html"));
});