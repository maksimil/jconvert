import { remote, ipcRenderer } from "electron";

const dialog = remote.dialog;

export const browse = async (open: boolean, id: string) => {
  let il = document.getElementById(id);
  if (!il) return;

  let path: string;

  if (open) {
    const res = await dialog.showOpenDialog({});
    if (res.canceled) return;
    path = res.filePaths[0];
  } else {
    const res = await dialog.showSaveDialog({});
    if (res.canceled && res.filePath) return;
    path = <string>res.filePath;
  }

  let nil = <HTMLInputElement>il;
  nil.value = path;
};

const datainputs = ["ipath", "opath", "tpath"].map(
  (e) => <HTMLInputElement>document.getElementById(e)
);

export const apply = () => {
  const [ipath, opath, tpath] = datainputs.map((e) => e.value);

  ipcRenderer.send("paths-config", {
    pathsconfig: { ipath, opath, tpath },
    mode: getmode(),
  });
};

// Select mode
export const getmode = () => {
  return mode;
};

let mode = "save";

const modes = ["save", "apply"];

const options: {
  [key: string]: HTMLButtonElement;
} = {
  save: <HTMLButtonElement>document.getElementById("save"),
  apply: <HTMLButtonElement>document.getElementById("apply"),
};

export const setmode = (_mode: string) => {
  mode = _mode;
  modes.forEach((k) => {
    if (k === mode) {
      options[k].classList.add("mode-selected");
    } else {
      options[k].classList.remove("mode-selected");
    }
  });
};
