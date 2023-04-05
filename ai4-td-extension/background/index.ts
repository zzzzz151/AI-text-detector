import { executeInCurrentTab } from "./utils";
import highlightSelection from "./highlight";

const injectHighlight = async (info) => {
  if (info.menuItemId === "scan-text") {
    await executeInCurrentTab({ func: highlightSelection, args: [info.selectionText] })
  }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "scan-text",
      title: "Scan text",
      contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  injectHighlight(info);
});