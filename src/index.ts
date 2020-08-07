import { remote, ipcRenderer } from "electron";

const dialog = remote.dialog;

const modeinput = <HTMLSelectElement>document.getElementById("mode");
// apply, save
export const getmode = () => modeinput.value;

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
