import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect } from "react";
import $ from 'jquery'

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

const element = "highlighted-text"

function Highlight() {
  const [color] = useStorage<string>("highlight-color")

  useEffect(() => {
    if (color) {
      $(element).css({backgroundColor: `${color}40`, borderBottom: `2px solid ${color}`})
    }
  }, [color]);

  $(element).on("click", (e) => {
    e.stopImmediatePropagation();
    console.log("HELLO")
  })

  $(document).on('DOMNodeInserted', element, function() {
    $(this).css({backgroundColor: `${color}40`, borderBottom: `2px solid ${color}`})
  });

  return null;
}

export default Highlight;
