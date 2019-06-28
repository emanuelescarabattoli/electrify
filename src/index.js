const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

// Menu.setApplicationMenu(null);

// When the app is ready, a window is opened with the index page loaded
app.on("ready", () => {
    const index = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        },
        fullscreen: true
    });

    // Here we load the index page of the application
    index.loadFile(path.join(__dirname, "index.html"));

    // On receiving the close message, the index window is closed
    ipcMain.on("close-index-window", () => window.close());
});