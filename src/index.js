const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { parseState } = require("./utils/parser");

// When the app is ready, a window is opened with the index page loaded
app.on("ready", () => {
    const index = new BrowserWindow({
        width: 800,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        },
        fullscreen: true,
        frame: false
    });

    // Here we load the index page of the application
    index.loadFile(path.join(__dirname, "index.html"));

    // On receiving the close message, the index window is closed
    ipcMain.on("close-index-window", () => window.close());

    // When gui wants to update the state a call to server is made
    ipcMain.on("update-sensors-state", readSensorsState);
});

// TODO: Implement socket transmission
// The function that update the sensors state by reading it from a socket
const readSensorsState = (event, args) => {
    const state = parseState("LIGHTGROUP1#ON;LIGHTGROUP2#OFF;LIGHTGROUP3#OFF;GATE#OFF")
    event.sender.send("sensors-state-updated", state);
}
