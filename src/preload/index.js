const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

contextBridge.exposeInMainWorld("save", {
  saveFile: () => {
    const textUrl =
      document.getElementById("text").value || `${os.homedir()}/Desktop`;
    const textarea = document.getElementById("textarea").value;
    const str = path.join(textUrl, "test.txt");
    fs.writeFile(str, textarea, () => {});
  },
});
