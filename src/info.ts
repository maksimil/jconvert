import { ipcRenderer } from "electron";

const root = <HTMLElement>document.getElementById("root");

ipcRenderer.on("init-data", (event, arg) => {
  let rt = `<tr><td class="title" colspan="${arg["twidth"]}">${arg["title"]}</td></tr>`;

  console.log(arg["lines"]);

  for (const line of arg["lines"]) {
    rt += "<tr>";
    for (const el of line) {
      rt += `<td>${el}</td>`;
    }
    rt += "</tr>";
  }

  root.innerHTML = rt;
});
