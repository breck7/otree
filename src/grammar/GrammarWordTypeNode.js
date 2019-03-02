const TreeNode = require("../base/TreeNode.js")
const TreeUtils = require("../base/TreeUtils.js")
const GrammarConstants = require("./GrammarConstants.js")

// todo: add standard types, enum types, from disk types

class AbstractGrammarWordTestNode extends TreeNode {}

class GrammarRegexTestNode extends AbstractGrammarWordTestNode {
  isValid(str) {
    if (!this._regex) this._regex = new RegExp(this.getContent())
    return str.match(this._regex)
  }
}

class GrammarKeywordTableTestNode extends AbstractGrammarWordTestNode {
  _getKeywordTable(runTimeGrammarBackedProgram) {
    // @keywordTable @wordType 1
    const nodeType = this.getWord(1)
    const wordIndex = parseInt(this.getWord(2))
    const table = {}
    runTimeGrammarBackedProgram.findNodes(nodeType).forEach(node => {
      table[node.getWord(wordIndex)] = true
    })
    return table
  }

  isValid(str, runTimeGrammarBackedProgram) {
    if (!this._keywordTable) this._keywordTable = this._getKeywordTable(runTimeGrammarBackedProgram)
    return this._keywordTable[str] === true
  }
}

class GrammarEnumTestNode extends AbstractGrammarWordTestNode {
  isValid(str) {
    // @enum c c++ java
    if (!this._map) this._map = TreeUtils.arrayToMap(this.getWordsFrom(1))
    return this._map[str]
  }
}

class GrammarWordParserNode extends TreeNode {
  parse(str) {
    const fns = {
      parseInt: parseInt,
      parseFloat: parseFloat
    }
    const fnName = this.getWord(2)
    const fn = fns[fnName]
    if (fn) return fn(str)
    return str
  }
}

class GrammarWordTypeNode extends TreeNode {
  getKeywordMap() {
    const types = []
    types[GrammarConstants.regex] = GrammarRegexTestNode
    types[GrammarConstants.keywordTable] = GrammarKeywordTableTestNode
    types[GrammarConstants.enum] = GrammarEnumTestNode
    types[GrammarConstants.parseWith] = GrammarWordParserNode
    return types
  }

  parse(str) {
    const parser = this.getNode(GrammarConstants.parseWith)
    return parser ? parser.parse(str) : str
  }

  isValid(str, runTimeGrammarBackedProgram) {
    str = str.replace(/\*$/, "") // todo: cleanup
    return this.getChildrenByNodeType(AbstractGrammarWordTestNode).every(node =>
      node.isValid(str, runTimeGrammarBackedProgram)
    )
  }

  getId() {
    return this.getWord(1)
  }

  getTypeId() {
    return this.getWord(1)
  }
}

class GrammarWordTypeIntNode extends GrammarWordTypeNode {
  isValid(str) {
    const num = parseInt(str)
    if (isNaN(num)) return false
    return num.toString() === str
  }

  parse(str) {
    return parseInt(str)
  }
}

class GrammarWordTypeBitNode extends GrammarWordTypeNode {
  isValid(str) {
    return str === "0" || str === "1"
  }

  parse(str) {
    return !!parseInt(str)
  }
}

class GrammarWordTypeFloatNode extends GrammarWordTypeNode {
  isValid(str) {
    return !isNaN(parseFloat(str))
  }

  parse(str) {
    return parseFloat(str)
  }
}

class GrammarWordTypeBoolNode extends GrammarWordTypeNode {
  isValid(str) {
    return new Set(["1", "0", "true", "false", "t", "f", "yes", "no"]).has(str.toLowerCase())
  }

  parse(str) {
    return !!parseInt(str)
  }
}

class GrammarWordTypeAnyNode extends GrammarWordTypeNode {
  isValid() {
    return true
  }
}

GrammarWordTypeNode.types = {
  any: GrammarWordTypeAnyNode,
  float: GrammarWordTypeFloatNode,
  bit: GrammarWordTypeBitNode,
  bool: GrammarWordTypeBoolNode,
  int: GrammarWordTypeIntNode
}

module.exports = GrammarWordTypeNode