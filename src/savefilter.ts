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
  let invalid: number[] = [];
  let j = 0;
  Object.keys(trainconfig).forEach((k) => {
    if (!trainconfig[k]) {
      invalid.push(j);
    }
    j++;
  });

  if (invalid.length !== 0) {
    // console.log(`${invalid} are invalid`);
    for (let i = 0; i < paraminputs.length; i++) {
      let inv = false;
      for (let k = 0; k < invalid.length; k++) {
        if (invalid[k] === i) {
          inv = true;
          break;
        }
      }
      if (inv) {
        paraminputs[i].classList.add("invalid");
      } else {
        paraminputs[i].classList.remove("invalid");
      }
    }
    return;
  }
  ipcRenderer.send("train-config", {
    pathsconfig,
    trainconfig,
  });
  window.close();
};
