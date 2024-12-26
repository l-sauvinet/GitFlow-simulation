let initialized = false;
let currentBranch = null;
let branches = [];
let fileCreated = false;
let fileModified = false;
let stagedContent = false;

const outputLog = document.getElementById("output-log");
const currentBranchElement = document.getElementById("current-branch");
const fileEditor = document.getElementById("file-editor");
const fileContentElement = document.getElementById("file-content");
const saveButton = document.getElementById("btn-save");

function log(message) {
  outputLog.innerHTML += `<p>${message}</p>`;
}

function updateVisualization() {
  const branchesContainer = document.getElementById("branches");
  branchesContainer.innerHTML = '';
  branches.forEach(branch => {
    const branchElement = document.createElement("div");
    branchElement.className = "branch";
    branchElement.textContent = branch;
    if (branch === currentBranch) {
      branchElement.style.fontWeight = "bold";
      branchElement.style.color = "#00796b";
    }
    branchesContainer.appendChild(branchElement);
  });
}

fileContentElement.addEventListener("input", () => {
  if (fileContentElement.value.trim() !== "") {
    saveButton.disabled = false;
    fileModified = true;
  }
});

function saveChanges() {
  if (fileModified) {
    saveButton.disabled = true;
    log("📄 Modifications enregistrées.");
    document.getElementById("btn-add").disabled = false;
    fileModified = false;
  }
}

function gitCommand(command) {
  switch (command) {
    case "init":
      if (!initialized) {
        initialized = true;
        branches.push("main");
        currentBranch = "main";
        log("📁 Repository initialisé. Branche actuelle : main.");
        currentBranchElement.textContent = "main";
        document.getElementById("btn-init").disabled = true;
        document.getElementById("btn-branch-dev").disabled = false;
      } else {
        log("❗ Repository déjà initialisé.");
      }
      break;

    case "branch-dev":
      if (initialized) {
        branches.push("dev");
        log("🌿 Branche 'dev' créée.");
        document.getElementById("btn-branch-dev").disabled = true;
        document.getElementById("btn-checkout-dev").disabled = false;
      }
      break;

    case "checkout-dev":
      if (branches.includes("dev") && currentBranch !== "dev") {
        currentBranch = "dev";
        log("🚀 Changement de branche vers 'dev'.");
        currentBranchElement.textContent = "dev";
        document.getElementById("btn-checkout-dev").disabled = true;
        document.getElementById("btn-create-file").disabled = false;
      }
      break;

    case "checkout-main":
      if (branches.includes("main") && currentBranch !== "main") {
        currentBranch = "main";
        log("🔄 Retour sur la branche 'main'.");
        currentBranchElement.textContent = "main";
        document.getElementById("btn-checkout-main").disabled = true;
      }
      break;

    case "create-file":
      if (currentBranch === "dev" && !fileCreated) {
        fileCreated = true;
        fileEditor.style.display = "block";
        log("📄 Fichier 'fichier.txt' créé dans la branche 'dev'.");
        document.getElementById("btn-create-file").disabled = true;
      }
      break;

    case "add":
      if (fileCreated && !fileModified) {
        stagedContent = true;
        log("📝 Modifications ajoutées à la zone de staging.");
        document.getElementById("btn-add").disabled = true;
        document.getElementById("btn-commit").disabled = false;
      }
      break;

    case "commit":
      if (stagedContent) {
        const commitMessage = prompt("Entrez le message de commit :");
        if (commitMessage && commitMessage.trim() !== "") {
          log(`💾 Commit enregistré : "${commitMessage}".`);
          stagedContent = false;
          document.getElementById("btn-commit").disabled = true;
          document.getElementById("btn-push").disabled = false;
        }
      }
      break;

    case "push":
      if (currentBranch === "dev") {
        log("📤 Modifications poussées sur la branche 'dev'.");
        document.getElementById("btn-push").disabled = true;
        document.getElementById("btn-checkout-main").disabled = false;
      }
      break;

    default:
      log("❓ Commande inconnue.");
  }
  updateVisualization();
}
