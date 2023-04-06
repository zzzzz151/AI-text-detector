function highlightSelection(data, keep = false, merge = true) {

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

  function createHighlightElement() {
    const highlight = document.createElement('highlighted-text');
    highlight.setAttribute("probability", data.probability_AI_generated);
    return highlight;
  }

  function isRelevantNode(node) {
    return  node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '')
  }

  function hasNoRelevantChildNodes(element) {
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (isRelevantNode(childNode)) {
        return false;
      }
    }
    return true;
  }

  function canMerge(prev, curr) {
    return prev
      && prev.nodeName === 'HIGHLIGHTED-TEXT'
      && prev.getAttribute('probability') === curr.getAttribute('probability');
  }
  
  function mergeHighlightedText(element) {
    let prevSibling = element.previousSibling;
    while (prevSibling && !isRelevantNode(prevSibling)) {
      prevSibling = prevSibling.previousSibling;
    }
    if (canMerge(prevSibling, element)) {
      prevSibling.textContent += element.textContent;
      element.parentNode.removeChild(element);
    }
  }
  
  
  function removeNestedHighlights(element) {
    const content = element.innerHTML;
    const fragment = document.createRange().createContextualFragment(content);
    element.replaceWith(fragment);
  }

  function keepNestedHighlights(element) {
    const parent = element.parentNode;
    const childElements = Array.from(element.childNodes);

    childElements.forEach((child: HTMLElement) => {
      if (child.nodeName === 'HIGHLIGHTED-TEXT') {
        if (child.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) {
          parent.insertBefore(child, element.nextSibling);
        } else {
          parent.insertBefore(child, element);
        }
      }
    });

    if (hasNoRelevantChildNodes(element)) {
      parent.removeChild(element);
    }
  }

  function refactorNestedHighlights(element) {
    if (keep) {
      keepNestedHighlights(element);
    }
    else {
      removeNestedHighlights(element)
    }
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  
  const range = window.getSelection().getRangeAt(0);

  const selectedNodes = getSelectedNodes(range);
  
  const prob = String(Math.round(Math.random() * 50 +  50));

  selectedNodes.forEach((node) => {
    const highlight = createHighlightElement();
    const nodeRange = getNodeRange(range, node);
    highlight.textContent = nodeRange.toString();

    nodeRange.deleteContents();
    nodeRange.insertNode(highlight);

    const parent = highlight.parentNode;
    if (parent.nodeName === "HIGHLIGHTED-TEXT") {
      refactorNestedHighlights(parent)
    }

    if (merge) {
      mergeHighlightedText(highlight)
    }
  });
}
  
export default highlightSelection;