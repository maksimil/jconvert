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

paraminputs[0].value = "1000";
paraminputs[1].value = "10";
paraminputs[2].value = "10";
paraminputs[3].value = "100";

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
