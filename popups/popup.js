var enabledDict = {};
const APPLICABLE_PROTOCOLS = ["http:", "https:"];
var toggle = document.getElementById("toggle");
var toggleStatus = document.getElementById("toggleStatus");

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
  const protocol = (new URL(url)).protocol;
  return APPLICABLE_PROTOCOLS.includes(protocol);
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log("Dark theme");
  document.getElementById("bodyId").classList.remove("bg-light");
  document.getElementById("bodyId").classList.add("bg-dark");
} else {
  console.log("Light theme");
  document.getElementById("bodyId").classList.remove("bg-dark");
  document.getElementById("bodyId").classList.add("bg-light");
}

chrome.storage.sync.get('enabledDict', async ({ enabledDict }) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("popup.js");
  console.log(tab.id);
  console.log(enabledDict);
  console.log(tab.url);

  if (tab.url == null || !protocolIsApplicable(tab.url)) {
    console.log("Disable extension");
    document.getElementById("bodyId").classList.remove("bodyEnabled");
    document.getElementById("bodyId").classList.add("bodyCompat");
    document.getElementById("popupContent").classList.add("hidden")
    document.getElementById("compatMessage").classList.remove("hidden");
  } else {
    console.log("Enable extension");
    document.getElementById("bodyId").classList.remove("bodyCompat");
    document.getElementById("bodyId").classList.add("bodyEnabled");
    document.getElementById("compatMessage").classList.add("hidden");
    document.getElementById("popupContent").classList.remove("hidden")
    if (enabledDict[tab.id]) {
      toggle.checked = true;
    }
  }

  toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
});

function doThing() {

  function removeInputAttribute(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].hasAttribute('readonly')) {
        array[i].removeAttribute('readonly');
      }
      if (array[i].hasAttribute('disabled')) {
        array[i].removeAttribute('disabled');
      }
    }
  };

  var textBoxes = document.querySelectorAll('input[type="text"]');
  var passwordBoxes = document.querySelectorAll('input[type="password"]');
  removeInputAttribute(textBoxes);
  removeInputAttribute(passwordBoxes);
}

toggle.addEventListener('change', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.storage.sync.get('enabledDict', ({ enabledDict }) => {
    if (toggle.checked) {
      enabledDict[tab.id] = true;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: doThing,
      });
    } else if (!toggle.checked) {
      delete enabledDict[tab.id];
    }

    toggleStatus.textContent = enabledDict[tab.id] ? 'Enabled' : 'Disabled';
    chrome.storage.sync.set({ enabledDict });
  });
});
