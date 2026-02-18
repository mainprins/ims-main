const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function startBackend() {
  backendProcess = spawn("node", ["index.js"], {
    cwd: path.join(__dirname, "ims-backend"), // go inside backend folder
    shell: true,
    stdio: "inherit",
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  // Load Vite dev server
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  startBackend();   // 🔥 Start backend first
  createWindow();   // 🔥 Then open Electron window
});

// Close backend when Electron closes
app.on("will-quit", () => {
  if (backendProcess) backendProcess.kill();
});
