import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useRef, useState } from "react";
import SingleCard from "~components/single-card";
import { ClickAwayListener } from "@mui/material";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

const ELEMENT = "highlighted-text";
const SINGLE_CARD_WIDTH = 200;
const SINGLE_CARD_HEIGHT = 50;
const OBSERVER_CONFIG = { childList: true, subtree: true };

function Highlight() {
  const [colorRegular] = useStorage<string>("highlight-color-regular", v => (v && (v.length == 4 || v.length == 7)) ? v : "#FFFF00")
  const [colorStrong] = useStorage<string>("highlight-color-strong", v => (v && (v.length == 4 || v.length == 7)) ? v : "#FF0000")
  const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null);
  const [clickedElementPosition, setClickedElementPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(ELEMENT);
  
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const probability = parseFloat(el.getAttribute("probability"));
  
      // Set the background color and border color based on the probability value
      if (probability >= 75) {
        el.style.backgroundColor = `${colorStrong}40`;
        el.style.borderBottom = `2px solid ${colorStrong}`;
      } else if (probability >= 50) {
        el.style.backgroundColor = `${colorRegular}40`;
        el.style.borderBottom = `2px solid ${colorRegular}`;
      }
    }
  }, [colorRegular, colorStrong]);
  
  

  const handleElementClick = (e) => {
    e.stopPropagation();

    const clickedElement = e.currentTarget;
  
    const elementRect = clickedElement.getBoundingClientRect();
    const docElem = document.documentElement;
    const elementLeft = elementRect.left + window.scrollX - docElem.clientLeft;
    const elementTop = elementRect.top + window.scrollY - docElem.clientTop;
  
    const elementWidth = clickedElement.offsetWidth;
    const elementHeight = clickedElement.offsetHeight;
  
    const clickPosition = {
      x: e.clientX,
      y: e.clientY,
    };
  
    let topPosition = elementTop - SINGLE_CARD_HEIGHT - 5;
    let leftPosition = clickPosition.x - SINGLE_CARD_WIDTH / 2;
  
    // Check if the SingleCard is outside clicked element
    if (leftPosition < elementLeft) {
      leftPosition = elementLeft;
    }
  
    // Check if the SingleCard overflows beyond the right edge of the viewport
    if (leftPosition + SINGLE_CARD_WIDTH > window.innerWidth) {
      leftPosition = elementLeft + elementWidth - SINGLE_CARD_WIDTH;
    }
  
    // Check if the SingleCard overflows beyond the top edge of the viewport
    if (topPosition < 0) {
      topPosition = elementTop + elementHeight + 5;
    }
  
    const position = {
      top: topPosition,
      left: leftPosition,
    };
    
    setClickedElementPosition(position);
    setClickedElement(clickedElement);
  };  

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      const addedNodes = mutation.addedNodes;
      addedNodes.forEach(function(node: HTMLElement) {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches(ELEMENT)) {
          const probability = parseFloat(node.getAttribute("probability"));
    
          if (probability >= 75) {
            node.style.backgroundColor = `${colorStrong}40`;
            node.style.borderBottom = `2px solid ${colorStrong}`;
          } else if (probability >= 50) {
            node.style.backgroundColor = `${colorRegular}40`;
            node.style.borderBottom = `2px solid ${colorRegular}`;
          }
            
          node.addEventListener("click", handleElementClick);
        }
      });
    });    
  });
  
  observer.observe(document.body, OBSERVER_CONFIG);
  

  const handleClickAway = () => {
    setClickedElement(null);
  }

  useEffect(() => {
    const handleResize = () => {
      setClickedElement(null);
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      {clickedElement && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div style={{ position: "absolute", ...clickedElementPosition }}>
            <SingleCard element={clickedElement} />
          </div>
        </ClickAwayListener>
      )}
    </>
  );
}

export default Highlight;
