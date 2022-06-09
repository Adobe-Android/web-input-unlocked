import * as common from "./common.js";

var enabledDict = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabledDict });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(changeInfo.status);
  console.log(tab.url);
  console.log(tabId);

  if (tab.url != null && common.protocolIsApplicable(tab.url)) {
    chrome.storage.sync.get('enabledDict', ({ enabledDict }) => {
      console.log("background.js");
      console.log(enabledDict);
      if (enabledDict[tabId]) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: common.removeInputAttributes,
        });
      }
    });
  }
});
