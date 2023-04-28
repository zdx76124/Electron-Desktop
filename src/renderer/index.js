// // 调用 node.js 的方法
const { ipcRenderer } = require("electron");
const os = require("os");
const platform = os.platform();
const release = os.release();

document.getElementById("platform").append(platform);
document.getElementById("release").append(release);

ipcRenderer
  .invoke("isDarkMode")
  .then((value) => console.log("invoke reply", value));
