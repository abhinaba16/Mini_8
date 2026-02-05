const editor = document.getElementById("codeEditor");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");

const tabs = document.getElementById("tabs");
const currentFile = document.getElementById("currentFile");

const fileInput = document.getElementById("fileInput");


/* FILE SYSTEM */

let files = {
  "index.html": "<h1>Hello World</h1>",
  "style.css": "h1{color:blue;}",
  "main.js": "console.log('Hello')"
};

let activeFile = "index.html";


/* INIT */

loadFromStorage();
renderTabs();
loadFile(activeFile);
runCode();


/* STORAGE */

function saveToStorage() {
  localStorage.setItem("files", JSON.stringify(files));
}

function loadFromStorage() {
  const data = localStorage.getItem("files");

  if (data) {
    files = JSON.parse(data);
  }
}


/* TABS */

function renderTabs() {

  tabs.innerHTML = "";

  for (let name in files) {

    const tab = document.createElement("div");

    tab.className = "tab";

    if (name === activeFile) {
      tab.classList.add("active");
    }

    tab.textContent = name;

    tab.onclick = () => switchFile(name);

    tabs.appendChild(tab);
  }
}


/* FILE SWITCH */

function switchFile(name) {

  saveCurrent();

  activeFile = name;

  loadFile(name);

  renderTabs();
}


function loadFile(name) {

  editor.value = files[name];

  currentFile.textContent = name;
}


function saveCurrent() {

  files[activeFile] = editor.value;

  saveToStorage();
}


/* ADD FILE */

function addFile() {

  const name = prompt("Enter file name (example: app.js)");

  if (!name) return;

  if (files[name]) {
    alert("File already exists!");
    return;
  }

  files[name] = "";

  activeFile = name;

  renderTabs();

  loadFile(name);

  saveToStorage();
}


/* UPLOAD FILES */

function openFile() {

  fileInput.click();
}


fileInput.addEventListener("change", function () {

  for (let file of this.files) {

    const reader = new FileReader();

    reader.onload = e => {

      files[file.name] = e.target.result;

      activeFile = file.name;

      renderTabs();

      loadFile(activeFile);

      saveToStorage();

      runCode();
    };

    reader.readAsText(file);
  }

  this.value = "";
});


/* RUN CODE */

function runCode() {

  saveCurrent();

  errorBox.textContent = "";

  const html = files["index.html"] || "";

  const css = `<style>${files["style.css"] || ""}</style>`;

  const js = `<script>
    try{
      ${files["main.js"] || ""}
    }catch(e){
      parent.document.getElementById("errorBox").textContent = e;
    }
  <\/script>`;

  output.srcdoc = html + css + js;
}


/* FULLSCREEN */

function toggleFullscreen() {

  if (!document.fullscreenElement) {
    output.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}


/* DOWNLOAD */

function downloadZIP() {

  let text = "";

  for (let name in files) {

    text += `
${name}
----------------
${files[name]}

`;
  }

  const blob = new Blob([text], { type: "text/plain" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "project.txt";

  link.click();
}


/* RESET */

function resetEditors() {

  if (!confirm("Clear project?")) return;

  files = {
    "index.html": "",
    "style.css": "",
    "main.js": ""
  };

  activeFile = "index.html";

  localStorage.clear();

  renderTabs();

  loadFile(activeFile);

  runCode();
}


/* AUTO SAVE */

editor.addEventListener("input", () => {

  saveCurrent();

  runCode();
});
