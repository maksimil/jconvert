import { ipcRenderer } from "electron";

const paraminputs = [
  document.getElementById("epochs"),
  document.getElementById("eta"),
  document.getElementById("leta"),
  document.getElementById("tl"),
].map((e) => <HTMLInputElement>e);

export const apply = () => {
  const [epochs, eta, leta, tl] = paraminputs.map((e) => e.value);
};
