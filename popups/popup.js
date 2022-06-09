import "../node_modules/@lottiefiles/lottie-interactivity/dist/lottie-interactivity.min.js";
import * as common from "../src/common.js";

const toggle = document.getElementById("toggle");
const toggleStatus = document.getElementById("toggleStatus");
const player = document.querySelector("lottie-player");
const refreshBtn = document.getElementById("refresh-btn");
const slider = document.getElementById("slider");

// Handle all dark & light theme logic
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log("Dark theme");
  player.load("lf30_editor_heoe3drh.json");
  document.getElementById("bodyId").classList.remove("bg-light");
  document.getElementById("bodyId").classList.add("bg-dark");
  document.getElementById("toggle-container").classList.remove("separator-light");
  document.getElementById("toggle-container").classList.add("separator-dark");
  slider.classList.remove("slider-light");
  slider.classList.add("slider-dark");
  refreshBtn.classList.remove("refresh-icon-light");
  refreshBtn.classList.add("refresh-icon-dark");
} else {
  console.log("Light theme");
  player.load("lf30_editor_xgdtcggs.json");
  document.getElementById("bodyId").classList.remove("bg-dark");
  document.getElementById("bodyId").classList.add("bg-light");
  document.getElementById("toggle-container").classList.remove("separator-dark");
  document.getElementById("toggle-container").classList.add("separator-light");
  slider.classList.remove("slider-dark");
  slider.classList.add("slider-light");
  refreshBtn.classList.remove("refresh-icon-dark");
  refreshBtn.classList.add("refresh-icon-light");
  // refresh-icon-dark
}

// Logic to show and hide views
chrome.storage.sync.get('enabledDict', async ({ enabledDict }) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("popup.js");
  console.log(tab.id);
  console.log(enabledDict);
  console.log(tab.url);

  if (tab.url == null || !common.protocolIsApplicable(tab.url)) {
    console.log("Disable extension");
    document.getElementById("bodyId").classList.remove("bodyEnabled");
    document.getElementById("bodyId").classList.add("bodyDisabled");
    document.getElementById("popupContent").classList.add("hidden")
    document.getElementById("compatMessage").classList.remove("hidden");
  } else {
    console.log("Enable extension");
    document.getElementById("bodyId").classList.remove("bodyDisabled");
    document.getElementById("bodyId").classList.add("bodyEnabled");
    document.getElementById("compatMessage").classList.add("hidden");
    document.getElementById("popupContent").classList.remove("hidden")
    if (enabledDict[tab.id]) {
      toggle.checked = true;
    }
  }

  toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
});

// Enable Lottie Interactivity click event
LottieInteractivity.create({
  player:'#refresh-btn',
  mode:"cursor",
  actions: [
      {
          type: "click",
          forceFlag: false
      }
  ]
});

refreshBtn.addEventListener("click", async () => {
  console.log("Refreshing...");
  chrome.tabs.reload();
});

toggle.addEventListener('change', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.storage.sync.get('enabledDict', ({ enabledDict }) => {
    if (toggle.checked) {
      document.getElementById("label-title").setAttribute("title", "Click to disable for this site")
      document.getElementById("label-title").setAttribute("aria-label", "Click to disable for this site")
      enabledDict[tab.id] = true;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: common.doThing,
      });
    } else if (!toggle.checked) {
      delete enabledDict[tab.id];
      document.getElementById("label-title").setAttribute("title", "Click to enable for this site")
      document.getElementById("label-title").setAttribute("aria-label", "Click to enable for this site")
    }

    toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
    chrome.storage.sync.set({ enabledDict });
  });
});
