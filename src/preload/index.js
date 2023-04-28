const { ipcRenderer, contextBridge } = require("electron");

// window.setTheme = (theme) => {
//   ipcRenderer.invoke("setTheme", theme);
// };

contextBridge.exposeInMainWorld("preloadApi", {
  setTheme: (theme) => {
    ipcRenderer.invoke("setTheme", theme);
  },
});
