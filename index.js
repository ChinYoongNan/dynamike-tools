const { app, BrowserWindow, ipcMain } = require('electron')

const DownloadManager = require("electron-download-manager");
DownloadManager.register({
  downloadFolder: app.getPath("downloads") + "/my-app-inital"
});
let win;
// const electronDl = require('electron-dl');

// electronDl();
ipcMain.on('download-item', async (event, url) => {
  console.log('Download item')
  autoUpdate(url);
  // const win = BrowserWindow.getFocusedWindow();
  //   try {
  //       console.log(await download(win, url, {
  //         directory: "C:/Users/yoong/Downloads/my-app"
  //     }));
      
  //   } catch (error) {
  //       if (error instanceof electronDl.CancelError) {
  //         console.info('item.cancel() was called');
  //   } else {
  //     console.error(error);
  //   }
  // }
});
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    // width: 600, 
    // height: 600,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/www/assets/logo.png`,    
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      preload: `file://${__dirname}/preload.js`,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadURL(`file://${__dirname}/www/index.html`)

  const fs = require("fs")

  const currPath =  `${__dirname}/www`
  const newPath =  `${__dirname}/www_bk`
  
  // fs.rename(currPath, newPath, function(err) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log("Successfully renamed the directory.")
  //   }
  // })
  // checkUpdate()
  console.log('check-updating')
  const updater = require("electron-updater");
  // const {autoUpdater} = require("electron-updater");
  const autoUpdater = updater.autoUpdater;
  console.log(autoUpdater)
  
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  win.maximize();
  win.show();
  
  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}
function checkUpdate(){
  console.log('index.js checkUpdate')
  // Inital app
const electron = require("electron");
//   const updater = require("electron-updater");
const {autoUpdater} = require("electron-updater");
//   const autoUpdater = updater.autoUpdater;

///////////////////
// Auto upadater //
///////////////////
autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "glpat-AFqy1fKGC3JhEotRZuDo" };
autoUpdater.autoDownload = true;

autoUpdater.setFeedURL({
  provider: "generic",
  url: "https://gitlab.com/api/v4/projects/29684595/jobs/artifacts/dynamike-v1/release-builds/com.dynamike.app-win32-x64/?job=build"
});

autoUpdater.on('checking-for-update', function () {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', function (info) {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', function (info) {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err) {
  sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', function (progressObj) {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', function (info) {
  sendStatusToWindow('Update downloaded; will install in 1 seconds');
});

autoUpdater.on('update-downloaded', function (info) {
  setTimeout(function () {
      autoUpdater.quitAndInstall();
  }, 1000);
});

autoUpdater.checkForUpdates();

function sendStatusToWindow(message) {
  console.log(message);
}
}
function autoUpdate(url){
  const DownloadManager = require("electron-download-manager");
  DownloadManager.register({
    downloadFolder: __dirname
  });
   //Single file download
   DownloadManager.download({
    url: "https://lh3.googleusercontent.com/d/1CGemN8rWrjgVDKu60PQ3fDYXAVBfIUlZ=s220"
}, function (error, info) {
    if (error) {
      console.log('Error')
        console.log(error);
        return;
    }

    console.log("DONE: " + info.url);
});
}


// Create window on electron initialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})