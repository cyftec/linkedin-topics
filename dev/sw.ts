import { PAGE_LOAD_COMPLETE_MSG } from "./@libs/constants";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url &&
    tab.url.includes("www.linkedin.com/feed") &&
    changeInfo?.status === "complete"
  ) {
    chrome.tabs.sendMessage(tabId, PAGE_LOAD_COMPLETE_MSG);
  }
});
