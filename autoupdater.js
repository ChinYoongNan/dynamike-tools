function download(){
    const { ipcRenderer } = require('electron')
      const newURL = "https://lh3.googleusercontent.com/d/1CGemN8rWrjgVDKu60PQ3fDYXAVBfIUlZ=s220"
      ipcRenderer.send('download-item', newURL) 
  
      ipcRenderer.on('download-success', (event, arg) => {
          console.log(arg)
      })
    }
    function checkUpdate(){
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