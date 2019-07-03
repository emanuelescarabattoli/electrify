const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const net = require("net");

const { parseState } = require("./utils/parser");

// The function that update the sensors state by reading it from a socket
// here we start reading sensors state and update the GUI according to current state
const readSensorsState = (event) => {
    client.connect(7000, "localhost", onClientConnecte);
    event.sender.send("sensors-state-updated", state);
}

// On client connected it starts to read sensors state
const onClientConnecte = () => {
    client.write("STATE");
}

// GUI is updated according to state
const onClientReceiveData = data => {
    if (data !== "DONE") {
        state = parseState(data.toString());
    }
}

// Logs the client errors
const onClientError = error => {
    console.error("Error " + error.message + " at " + new Date())
}

// Global state of sensors
let state = {};

// Creating the client object
const client = new net.Socket();

// Bind client event's to functions
client.on("data", onClientReceiveData);
client.on("error", onClientError);

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

    // Start receiving signals from GUI
    ipcMain.on("update-sensors-state", readSensorsState);
});
