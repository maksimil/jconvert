"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browse = exports.getmode = void 0;
const electron_1 = require("electron");
const dialog = electron_1.remote.dialog;
const modeinput = document.getElementById("mode");
// apply, save
exports.getmode = () => modeinput.value;
exports.browse = async (open, id) => {
    let il = document.getElementById(id);
    if (!il)
        return;
    let path;
    if (open) {
        const res = await dialog.showOpenDialog({});
        if (res.canceled)
            return;
        path = res.filePaths[0];
    }
    else {
        const res = await dialog.showSaveDialog({});
        if (res.canceled && res.filePath)
            return;
        path = res.filePath;
    }
    let nil = il;
    nil.value = path;
};
