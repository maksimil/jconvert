import { ipcRenderer } from "electron";

let pathsconfig = {};
ipcRenderer.on("init-data", (event, arg) => {
  pathsconfig = arg;
});

const paraminputs = [
  document.getElementById("epochs"),
  document.getElementById("eta"),
  document.getElementById("leta"),
  document.getElementById("testlength"),
].map((e) => <HTMLInputElement>e);

export const apply = () => {
  const [epochs, eta, leta, testlength] = paraminputs.map((e) => e.value);
  const trainconfig: { [key: string]: number } = {
    epochs: parseInt(epochs),
    eta: parseFloat(eta),
    leta: parseInt(leta),
    testlength: parseInt(testlength),
  };

  // NaN check
  let invalid: string | boolean = false;
  Object.keys(trainconfig).forEach((k) => {
    if (!trainconfig[k]) {
      invalid = k;
    }
  });

  if (invalid) {
    // TODO: put red on invalud fields
    console.log(`${invalid} is invalid`);
    return;
  }
  ipcRenderer.send("train-config", {
    pathsconfig,
    trainconfig,
  });
  window.close();
};
