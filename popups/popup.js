import "../node_modules/@lottiefiles/lottie-interactivity/dist/lottie-interactivity.min.js";
import * as common from "../src/common.js";

const toggle = document.getElementById("js-toggle");
const toggleStatus = document.getElementById("js-toggle-status");
const player = document.querySelector("lottie-player");
const refreshBtn = document.getElementById("js-refresh-btn");
const refreshBtnContainer = document.getElementById("js-refresh-btn-container");
const slider = document.getElementById("js-slider");

// Handle all dark & light theme logic
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log("Dark theme");
  player.load("../assets/lf30_editor_heoe3drh.json");
  document.getElementById("js-body-id").classList.remove("bg-light");
  document.getElementById("js-body-id").classList.add("bg-dark");
  document.getElementById("js-toggle-container").classList.remove("separator-light");
  document.getElementById("js-toggle-container").classList.add("separator-dark");
  slider.classList.remove("slider-light");
  slider.classList.add("slider-dark");
  refreshBtnContainer.classList.remove("refresh-icon-light");
  refreshBtnContainer.classList.add("refresh-icon-dark");
} else {
  console.log("Light theme");
  player.load("../assets/lf30_editor_xgdtcggs.json");
  document.getElementById("js-body-id").classList.remove("bg-dark");
  document.getElementById("js-body-id").classList.add("bg-light");
  document.getElementById("js-toggle-container").classList.remove("separator-dark");
  document.getElementById("js-toggle-container").classList.add("separator-light");
  slider.classList.remove("slider-dark");
  slider.classList.add("slider-light");
  refreshBtnContainer.classList.remove("refresh-icon-dark");
  refreshBtnContainer.classList.add("refresh-icon-light");
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
    document.getElementById("js-body-id").classList.remove("body-enabled");
    document.getElementById("js-body-id").classList.add("body-disabled");
    document.getElementById("js-popup-content").classList.add("hidden")
    document.getElementById("js-compat-message").classList.remove("hidden");
  } else {
    console.log("Enable extension");
    document.getElementById("js-body-id").classList.remove("body-disabled");
    document.getElementById("js-body-id").classList.add("body-enabled");
    document.getElementById("js-compat-message").classList.add("hidden");
    document.getElementById("js-popup-content").classList.remove("hidden")
    if (enabledDict[tab.id]) {
      toggle.checked = true;
      document.getElementById("js-label-title").setAttribute("title", "Click to disable for this site")
      document.getElementById("js-label-title").setAttribute("aria-label", "Click to disable for this site")
    }
  }

  toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
});

// Enable Lottie Interactivity click event
LottieInteractivity.create({
  player: '#js-refresh-btn',
  mode: "cursor",
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
      document.getElementById("js-label-title").setAttribute("title", "Click to disable for this site")
      document.getElementById("js-label-title").setAttribute("aria-label", "Click to disable for this site")
      enabledDict[tab.id] = true;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: common.removeInputAttributes,
      });
    } else if (!toggle.checked) {
      delete enabledDict[tab.id];
      document.getElementById("js-label-title").setAttribute("title", "Click to enable for this site")
      document.getElementById("js-label-title").setAttribute("aria-label", "Click to enable for this site")
    }

    toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
    chrome.storage.sync.set({ enabledDict });
  });
});
