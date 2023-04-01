import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

class HighlightedTextHTMLElement extends HTMLElement {
  constructor() {
    super();
  }

  /* 
   * Only add attributes when the element is connected to the document
   * to prevent - Uncaught DOMException: Failed to construct 'CustomElement'
   */
  connectedCallback() {
    if (this.isConnected) {
      this.style.backgroundColor = "yellow";
      this.addEventListener("click", (event) => {
        alert("hello")
      });
    }
  }
}

window.customElements.define('highlighted-text', HighlightedTextHTMLElement);