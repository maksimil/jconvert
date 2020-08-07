import { ipcRenderer } from "electron";

ipcRenderer.on("init-data", (event, arg) => {
  console.log(arg);
});

const paraminputs = [
  document.getElementById("epochs"),
  document.getElementById("eta"),
  document.getElementById("leta"),
  document.getElementById("tl"),
].map((e) => <HTMLInputElement>e);

export const apply = () => {
  const [epochs, eta, leta, tl] = paraminputs.map((e) => e.value);
  ipcRenderer.send("train-config", { epochs, eta, leta, tl });
};
