const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const MainScreen = require("./mainScreen");
// const Globals = require("./globals");
const { autoUpdater, AppUpdater } = require("electron-updater");

let curWindow;

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// function createWindow () {
  
//   // Create the browser window.
//   win = new BrowserWindow({
//     // width: 600, 
//     // height: 600,
//     backgroundColor: '#ffffff',
//     icon: `file://${__dirname}/www/assets/logo.png`,    
//     webPreferences: {
//       // preload: path.join(__dirname, 'preload.js'),
//       preload: `file://${__dirname}/preload.js`,
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   })
//   win.loadURL(`file://${__dirname}/www/index.html`)

//   // const fs = require("fs")

//   // const currPath =  `${__dirname}/www`
//   // const newPath =  `${__dirname}/www_bk`
  
//   // fs.rename(currPath, newPath, function(err) {
//   //   if (err) {
//   //     console.log(err)
//   //   } else {
//   //     console.log("Successfully renamed the directory.")
//   //   }
//   // })
  
//   //// uncomment below to open the DevTools.
//   win.webContents.openDevTools()

//   win.maximize();
//   win.show();
  
//   // Event when the window is closed.
//   win.on('closed', function () {
//     win = null
//   })
// }

function createWindow() {
  curWindow = new MainScreen();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  autoUpdater.checkForUpdates();
  curWindow.showMessage(`Checking for updates. Current version ${app.getVersion()}`);
});

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  curWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
  let pth = autoUpdater.downloadUpdate();
  curWindow.showMessage(pth);
});

autoUpdater.on("update-not-available", (info) => {
  curWindow.showMessage(`No update available. Current version ${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  curWindow.showMessage(`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
  curWindow.showMessage(info);
});




//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});