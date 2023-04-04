interface TrieOptions {
    case?: 'sensitive' | 'insensitive';
}

function buildTrie(words: string[]) {
    const root = new TrieNode();
    for (const word of words) {
      let node = root;
      for (const char of word) {
        node = node.addChild(char);
      }
      node.isEndOfWord = true;
    }
    return new Trie(root);
}
  
class TrieNode {
  children: Map<any, any>;
  isEndOfWord: boolean;
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }

  addChild(char) {
    if (!this.children.has(char)) {
      this.children.set(char, new TrieNode());
    }
    return this.children.get(char);
  }

  getChild(char) {
    return this.children.get(char);
  }

  getWords(prefix = '') {
    const words = [];
    if (this.isEndOfWord) {
      words.push(prefix);
    }
    for (const [char, child] of this.children) {
      words.push(...child.getWords(prefix + char));
    }
    return words;
  }
}
  
class Trie {
  root: any;
  constructor(root) {
    this.root = root;
  }

  search(text) {
    let node = this.root;
    for (const char of text) {
      node = node.getChild(char);
      if (!node) {
        return [];
      }
    }
    return node.getWords(text);
  }
}
  
export default buildTrie;
  