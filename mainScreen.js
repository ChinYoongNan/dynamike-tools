const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

class MainScreen {
  window;

  position = {
    width: 1000,
    height: 600,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      // width: 600, 
      // height: 600,
      backgroundColor: '#ffffff',
      // icon: `file://${__dirname}/www/assets/logo.png`,  
      show: false,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, "./preload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    let wc = this.window.webContents;
    // wc.openDevTools({ mode: "undocked" });

    // this.window.loadURL(`file://${__dirname}/www/index.html`)
    this.window.loadFile("./www/index.html");
  }

  showMessage(message) {
    console.log("showMessage trapped");
    console.log(message);
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
}

module.exports = MainScreen;
