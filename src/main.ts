// const { app, BrowserWindow } = require('electron');
// const path = require('path');

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { loadfilter, filterimg } from "./imagefilter";
import { gbth } from "./mom";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

export const createwindow = (
  name: string,
  width: number,
  height: number,
  args: any = {}
) => {
  // Create the browser window.
  let win = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    resizable: false,
    icon: path.join(__dirname, "../icons/logo.ico"),
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  win.loadFile(path.join(__dirname, name));

  win.setMenu(null);

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("init-data", args);
    win.show();
  });

  // Open the DevTools.
  win.webContents.openDevTools();

  return win;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createwindow("index.html", 600, 180);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createwindow("index.html", 600, 180);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("paths-config", async (event, { mode, pathsconfig }) => {
  if (mode === "save") {
    // In save filter mode
    // Opening savefilter and passing pathsconfig to it
    createwindow("savefilter.html", 300, 180, pathsconfig);
  } else if (mode === "apply") {
    // In apply filter mode
    const filter = loadfilter(pathsconfig.tpath);

    await filterimg(filter, pathsconfig.ipath, pathsconfig.opath);
  }
});

// Recieved from savfilter
ipcMain.on("train-config", async (event, { pathsconfig, trainconfig }) => {
  // making a filter
  // console.log({ pathsconfig, trainconfig });

  const datastring = JSON.stringify({
    pathsconfig,
    trainconfig,
  });

  const child = gbth("public/loadprocess.js", datastring, (c) => {
    // console.log(`"${c}"`);
    try {
      const { loss } = JSON.parse(c);

      // console.log(loss);

      child.kill();
      createwindow("info.html", 400, 200, { title: "Load finished", loss });
    } catch (e) {
      // console.log(e);
    }
  });
});
