const { app, BrowserWindow } = require("electron");

let win;

app.whenReady().then(() => {
  createWindow();
});

function createWindow() {
  win = new BrowserWindow({ width: 1000, height: 800 });
  win.loadURL(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width"
  );
}
