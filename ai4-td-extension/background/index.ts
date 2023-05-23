import { callApi, executeInCurrentTab } from "./scripting";
import highlightSelection from "./highlight";
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const URL = process.env.PLASMO_PUBLIC_API_URL;

const injectHighlight = async (selectionText) => {
  const languageModel = (await storage.get("model")) ?? process.env.PLASMO_PUBLIC_DEFAULT_MODEL;
  callApi(URL, { model: languageModel, text: selectionText })
  .then(async data => {
    await executeInCurrentTab({ func: highlightSelection, args: [data] })
  });
}

const handleScanClick = async (info) => {
  injectHighlight(info.selectionText)
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "scan-text",
      title: "Scan text",
      contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleScanClick(info);
});

// Keyboard Shortcut Listener
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "scan-selection") {
    const selectionText = await executeInCurrentTab({
      func: () => {
        const selection = window.getSelection();
        return selection.toString().trim();
      },
    });
    if (selectionText) {
      injectHighlight(selectionText);
    }
  }
});