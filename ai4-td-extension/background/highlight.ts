function highlightSelection(selectionText: string) {

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
  
  const range = window.getSelection().getRangeAt(0);
  const selectedNodes = getSelectedNodes(range);

  selectedNodes.forEach((node) => {
    const highlight = document.createElement('highlighted-text');
    highlight.setAttribute("probability", "50");
    const nodeRange = getNodeRange(range, node);
    highlight.textContent = nodeRange.toString();

    nodeRange.deleteContents();
    nodeRange.insertNode(highlight);
  })
}

export default highlightSelection;