import { callApi, executeInCurrentTab } from "./scripting";
import highlightSelection from "./highlight";
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const URL = "http://127.0.0.1:8000/api/v1";

const injectHighlight = async (info) => {
  if (info.menuItemId === "scan-text") {
    const languageModel = await storage.get("language-model");
    callApi(URL, { "language_model": languageModel, "text": info.selectionText })
    .then(async data => {
      console.log(languageModel)
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