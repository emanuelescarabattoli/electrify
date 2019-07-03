const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const net = require("net");

const { parseState } = require("./utils/parser");

// Global state of sensors
let state = {};

// Last message to send to server
let message = "STATE";

// Creating the client object to read status from server
const client = new net.Socket();

// The function that update the sensors state by reading it from a socket
// here we start reading sensors state and update the GUI according to current state
const syncSensorsState = (event) => {
    client.connect(7000, "localhost", onClientConnect);
    event.sender.send("sensors-state-updated", state);
}

// On client connected it starts to ask for sensors state
// if there is a message to send to server it will be sent
const onClientConnect = () => {
    client.write(message);
    message = "STATE";
}

// GUI is updated according to state
const onClientReceiveData = data => {
    state = parseState(data.toString());
}

// Logs the client errors
const onClientError = error => {
    console.error("Error on client read " + error.message + " at " + new Date())
}

// The function that send a message to server to update the state of a sensor
const writeSensorState = (event, data) => {
    message = data;
}

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
    ipcMain.on("update-sensors-state", syncSensorsState);

    // When GUI wants to update the status of a sensor a message is sent
    ipcMain.on("send-sensor-state", writeSensorState);
});
