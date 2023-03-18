import highlightSelection from "./highlight";
import { executeInCurrentTab, generateRandomColor } from "./utils";
import { Storage } from "@plasmohq/storage";

const storage = new Storage()

const injectHighlight = async (info) => {
  if (info.menuItemId === "scan-text") {
    await executeInCurrentTab({ func: highlightSelection, args: [info.selectionText, 55] })
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