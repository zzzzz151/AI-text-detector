import { callApi, executeInCurrentTab } from "./scripting";
import highlightSelection from "./highlight";
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const URL = process.env.PLASMO_PUBLIC_API_URL;

const injectHighlight = async (info) => {
  if (info.menuItemId === "scan-text") {
    const languageModel = await storage.get("model") ?? process.env.PLASMO_PUBLIC_DEFAULT_MODEL;
    callApi(URL, { model: languageModel, text: info.selectionText })
    .then(async data => {
      await executeInCurrentTab({ func: highlightSelection, args: [data] })
    });
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