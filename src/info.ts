import { ipcRenderer } from "electron";

const root = <HTMLElement>document.getElementById("root");

ipcRenderer.on("init-data", (event, arg) => {
  Object.keys(arg).forEach((k) => {
    root.innerHTML += `<tr><td>${k}:</td><td>${arg[k]}</td></tr>`;
  });
});
