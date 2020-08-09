import { ipcRenderer } from "electron";

const root = <HTMLElement>document.getElementById("root");

ipcRenderer.on("init-data", (event, arg) => {
  root.innerHTML += `<tr><td class="title" colspan="2">${arg["title"]}</td></tr>`;
  Object.keys(arg).forEach((k) => {
    if (k !== "title")
      root.innerHTML += `<tr><td>${k}</td><td>${arg[k]}</td></tr>`;
  });
});
