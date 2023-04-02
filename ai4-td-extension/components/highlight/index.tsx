import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import $ from 'jquery'
import SingleCard from "~components/single-card";
import { ClickAwayListener } from "@mui/material";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

const ELEMENT = "highlighted-text"
const SINGLE_CARD_WIDTH = 200

function Highlight() {
  const [color] = useStorage<string>("highlight-color")
  const [showSingleCard, setShowSingleCard] = useState(false);
  const [clickedElementPosition, setClickedElementPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (color) {
      $(ELEMENT).css({
        backgroundColor: `${color}40`,
        borderBottom: `2px solid ${color}`,
      });
    }
  }, [color]);

  const handleElementClick = (e) => {
    e.stopPropagation();

    const clickedElement = e.currentTarget;

    const elementLeft = $(clickedElement).offset().left
    const elementTop = $(clickedElement).offset().top

    const elementWidth = $(clickedElement).outerWidth();
    const elementHeight = $(clickedElement).outerHeight();

    const clickPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    let topPosition =  elementTop - 50;
    let leftPosition = clickPosition.x - SINGLE_CARD_WIDTH / 2;

    // Check if the SingleCard is outside clicked element
    if (leftPosition < elementLeft) {
      leftPosition = elementLeft
    }

    // Check if the SingleCard overflows beyond the right edge of the viewport
    if (leftPosition + SINGLE_CARD_WIDTH > window.innerWidth) {
      leftPosition = elementLeft + elementWidth - SINGLE_CARD_WIDTH;
    }

    // Check if the SingleCard overflows beyond the top edge of the viewport
    if (topPosition < 0) {
      topPosition = elementTop + elementHeight + 10;
    }

    const position = {
      top: topPosition,
      left: leftPosition,
    };
    setClickedElementPosition(position);
    setShowSingleCard(true);
  };
  
  

  $(document).on('DOMNodeInserted', ELEMENT, function() {
    $(this).css({
      backgroundColor: `${color}40`,
      borderBottom: `2px solid ${color}`,
    });
    $(this).on("click", handleElementClick)
  });

  const handleClickAway = () => {
    setShowSingleCard(false)
  }

  return (
    <>
      {showSingleCard && (
        <ClickAwayListener onClickAway={handleClickAway}>
        <div style={{ position: "absolute", ...clickedElementPosition }}>
          <SingleCard />
        </div>
        </ClickAwayListener>
      )}
    </>
  );
}

export default Highlight;
