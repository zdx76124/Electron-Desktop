const { app, BrowserWindow, nativeTheme, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

// 自定义协议
const protocol = "juejin";
app.setAsDefaultProtocolClient(protocol);

let urlParams = {};
const scheme = `${protocol}://`;

handelSchemeWakeup(process.argv);

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // 不允许启动多个实例
  app.quit();
} else {
  // 第二个实例被强制退出时将第一个实例窗口显示到前台
  // Electron 提供了 second-instance 事件用于在「第一实例」里面监听「第二实例」启动的行为，来驱动「第一实例」对该行为做出合适的反馈
  app.on("second-instance", (event, argv, workingDirectory) => {
    // Mac 平台只需展示窗口
    mainWindow.restore();
    mainWindow.show();

    // Window 平台上需要判断新的实例是否被 scheme 唤起
    handelSchemeWakeup(argv);
  });
}

// 获取唤起的参数
/** 协议唤起在 Mac 平台上的注意
      open-url 要在 ready 事件之前注册，因为有些场景是需要拿到参数之后在决定如何创建窗口的，如果放在 ready 回调里面， createWindow 可能会拿不到该参数
    在应用支持多实例场景下
      如果程序未启动，会立即启动应用，在 open-url 中获取到唤起参数
      如果存在正在运行的实例 （可能多个），会激活（其中一个）已经运行的程序，而不会开启新的实例，被激活的实例可以通过 open-url 回调获取唤起参数
**/
app.on("open-url", (event, url) => {
  handelSchemeWakeup(url);
});

app.whenReady().then(async () => {
  createWindow();
  // mainWindow.webContents.openDevTools();
});

function createWindow() {
  const width = parseInt(urlParams.width) || 800;
  const height = parseInt(urlParams.height) || 600;
  if (mainWindow) {
    mainWindow.setSize(width, height);
  } else {
    mainWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        // nodeIntegration: true, // 开启 node.js 环境集成
        contextIsolation: true, // 关闭上下文隔离
        nodeIntegration: false, // 不开启 node.js 环境集成
        sandbox: false,
        preload: path.join(__dirname, "../preload/index.js"), // 在 preload 脚本中访问 node 的 API
      },
    });
    // mainWindow.loadURL("https://www.juejin.cn");
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

function handelSchemeWakeup(argv) {
  const url = [].concat(argv).find((v) => v.startsWith(scheme));
  // 如果发现 ${scheme}:// 前缀，说明是通过 scheme 唤起
  if (!url) return;
  const searchParams = new URLSearchParams(url.slice(scheme.length));
  urlParams = Object.fromEntries(searchParams.entries());
  if (app.isReady()) createWindow();
}

ipcMain.handle("isDarkMode", (event, args) => {
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("setTheme", (event, theme) => {
  nativeTheme.themeSource = theme;
});
