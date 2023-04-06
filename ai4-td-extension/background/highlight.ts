function highlightSelection(selectionText: string, keep = false, merge = true) {

  const getNodeRange = (range, node) => {
    const nodeRange = document.createRange();
  
    nodeRange.selectNodeContents(node);
    const nodeStart = nodeRange.compareBoundaryPoints(Range.START_TO_START, range);
    const nodeEnd = nodeRange.compareBoundaryPoints(Range.END_TO_END, range);
    
    if (nodeStart < 0) {
      nodeRange.setStart(range.startContainer, range.startOffset);
    }
    
    if (nodeEnd > 0) {
      nodeRange.setEnd(range.endContainer, range.endOffset);
    }
    
    return nodeRange;
  }
  
  const getSelectedNodes = (range) => {
    const selectedNodes = [];
  
    // Check if selection spans a single node
    if (range.startContainer === range.endContainer) {
      selectedNodes.push(range.startContainer);
      return selectedNodes;
    }
  
    const treeWalker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      (node) => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    );
  
    let node;
    while ((node = treeWalker.nextNode())) {
      selectedNodes.push(node);
    }
  
    return selectedNodes;
  }

  function createHighlightElement(prob) {
    const highlight = document.createElement('highlighted-text');
    highlight.setAttribute("probability", prob);
    return highlight;
  }

  function canMerge(element1, element2) {
    return element1.nodeName === "HIGHLIGHTED-TEXT" && element2.nodeName === "HIGHLIGHTED-TEXT" && element1.getAttribute("probability") === element2.getAttribute("probability")
  }

  function mergeSiblingHighlights(element) {
    const children = Array.from(element.children);
    children.forEach((child: HTMLElement, i) => {
      if (i === 0) {
        return;
      }
      const prevChild = children[i - 1] as HTMLElement;
      if (canMerge(prevChild, child)) {
        const mergedText = prevChild.textContent + child.textContent;
        prevChild.textContent = mergedText;
        element.removeChild(child);
      }
    });
  }

  function removeNestedHighlights(element) {
    const content = element.innerHTML;
    const fragment = document.createRange().createContextualFragment(content);
    element.replaceWith(fragment);
  }

  function keepNestedHighlights(element) {
    const childElements = Array.from(element.childNodes);
    childElements.forEach((child: HTMLElement) => {
      if (child.nodeName === 'HIGHLIGHTED-TEXT') {
        if (child.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) {
          element.parentNode.insertBefore(child, element.nextSibling);
        } else {
          element.parentNode.insertBefore(child, element);
        }
      }
    });
  }

  function refactorNestedHighlights(element) {
    if (keep) {
      keepNestedHighlights(element);
    }
    else {
      removeNestedHighlights(element)
    }
    if (merge) {
      mergeSiblingHighlights(element.parentNode)
    }
  }
  
  const range = window.getSelection().getRangeAt(0);
  const selectedNodes = getSelectedNodes(range);
  const prob = String(Math.round(Math.random() * 50 +  50));

  selectedNodes.forEach((node) => {
    const highlight = createHighlightElement(prob);
    const nodeRange = getNodeRange(range, node);
    highlight.textContent = nodeRange.toString();

    nodeRange.deleteContents();
    nodeRange.insertNode(highlight);

    const parent = highlight.parentNode;
    if (parent.nodeName === "HIGHLIGHTED-TEXT") {
      refactorNestedHighlights(parent)
    }
  });
}
  
export default highlightSelection;