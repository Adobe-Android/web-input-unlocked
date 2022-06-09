var enabledDict = {};
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabledDict });
});

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
  const protocol = (new URL(url)).protocol;
  return APPLICABLE_PROTOCOLS.includes(protocol);
}

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(changeInfo.status);
  console.log(tab.url);
  console.log(tabId);

  if (tab.url != null && protocolIsApplicable(tab.url)) {
    chrome.storage.sync.get('enabledDict', ({ enabledDict }) => {
      console.log("background.js");
      console.log(enabledDict);
      if (enabledDict[tabId]) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: doThing,
        });
      }
    });
  }
});
