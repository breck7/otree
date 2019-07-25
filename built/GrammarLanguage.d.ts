import TreeNode from "./base/TreeNode";
import jTreeTypes from "./jTreeTypes";
interface AbstractRuntimeProgramConstructorInterface {
    new (code: string): GrammarBackedRootNode;
}
declare type parserInfo = {
    firstWordMap: {
        [firstWord: string]: nodeTypeDefinitionNode;
    };
    regexTests: jTreeTypes.regexTestDef[];
};
declare enum PreludeCellTypeIds {
    anyCell = "anyCell",
    anyFirstCell = "anyFirstCell",
    extraWordCell = "extraWordCell",
    floatCell = "floatCell",
    numberCell = "numberCell",
    bitCell = "bitCell",
    boolCell = "boolCell",
    intCell = "intCell"
}
declare enum GrammarConstants {
    extensions = "extensions",
    toolingDirective = "tooling",
    todoComment = "todo",
    version = "version",
    nodeTypeOrder = "nodeTypeOrder",
    nodeType = "nodeType",
    cellType = "cellType",
    nodeTypeSuffix = "Node",
    cellTypeSuffix = "Cell",
    regex = "regex",
    reservedWords = "reservedWords",
    enumFromCellTypes = "enumFromCellTypes",
    enum = "enum",
    baseNodeType = "baseNodeType",
    blobNode = "blobNode",
    errorNode = "errorNode",
    extends = "extends",
    abstract = "abstract",
    root = "root",
    match = "match",
    pattern = "pattern",
    inScope = "inScope",
    cells = "cells",
    catchAllCellType = "catchAllCellType",
    firstCellType = "firstCellType",
    catchAllNodeType = "catchAllNodeType",
    constants = "constants",
    required = "required",
    single = "single",
    tags = "tags",
    BlobNode = "BlobNode",
    defaultRootNode = "defaultRootNode",
    javascript = "javascript",
    compilerNodeType = "compiler",
    compilesTo = "compilesTo",
    description = "description",
    example = "example",
    frequency = "frequency",
    highlightScope = "highlightScope"
}
declare abstract class GrammarBackedNode extends TreeNode {
    abstract getDefinition(): AbstractGrammarDefinitionNode;
    getAutocompleteResults(partialWord: string, cellIndex: jTreeTypes.positiveInt): {
        text: string;
        displayText: string;
    }[];
    getChildInstancesOfNodeTypeId(nodeTypeId: jTreeTypes.nodeTypeId): GrammarBackedNode[];
    doesExtend(nodeTypeId: jTreeTypes.nodeTypeId): boolean;
    _getErrorNodeErrors(): UnknownNodeTypeError[];
    _getBlobNodeCatchAllNodeType(): typeof BlobNode;
    private _getAutocompleteResultsForFirstWord;
    private _getAutocompleteResultsForCell;
    abstract getGrammarProgramRoot(): GrammarProgram;
    abstract getRootProgramNode(): GrammarBackedRootNode;
    protected _getGrammarBackedCellArray(): AbstractGrammarBackedCell<any>[];
    getRunTimeEnumOptions(cell: AbstractGrammarBackedCell<any>): string[];
    protected _getRequiredNodeErrors(errors?: jTreeTypes.TreeError[]): jTreeTypes.TreeError[];
}
declare class TypedWord {
    private _node;
    private _cellIndex;
    private _type;
    constructor(node: TreeNode, cellIndex: number, type: string);
    replace(newWord: string): void;
    readonly word: string;
    readonly type: string;
    toString(): string;
}
declare abstract class GrammarBackedRootNode extends GrammarBackedNode {
    getRootProgramNode(): this;
    createParser(): import("./base/Parser").default;
    getAllTypedWords(): TypedWord[];
    findAllWordsWithCellType(cellTypeId: jTreeTypes.cellTypeId): TypedWord[];
    findAllNodesWithNodeType(nodeTypeId: jTreeTypes.nodeTypeId): any[];
    getDefinition(): GrammarProgram;
    getInPlaceCellTypeTree(): string;
    getParseTable(maxColumnWidth?: number): string;
    getErrors(): jTreeTypes.TreeError[];
    getInvalidNodeTypes(): any[];
    getAllSuggestions(): string;
    getAutocompleteResultsAt(lineIndex: jTreeTypes.positiveInt, charIndex: jTreeTypes.positiveInt): {
        startCharIndex: number;
        endCharIndex: number;
        word: string;
        matches: {
            text: string;
            displayText: string;
        }[];
    };
    getPrettified(): string;
    getNodeTypeUsage(filepath?: string): TreeNode;
    getInPlaceHighlightScopeTree(): string;
    getInPlaceCellTypeTreeWithNodeConstructorNames(): string;
    getTreeWithNodeTypes(): string;
    getCellHighlightScopeAtPosition(lineIndex: number, wordIndex: number): jTreeTypes.highlightScope | undefined;
    private _cache_programCellTypeStringMTime;
    private _cache_highlightScopeTree;
    private _cache_typeTree;
    protected _initCellTypeCache(): void;
}
declare abstract class GrammarBackedNonRootNode extends GrammarBackedNode {
    getRootProgramNode(): GrammarBackedRootNode;
    createParser(): import("./base/Parser").default;
    getNodeTypeId(): jTreeTypes.nodeTypeId;
    getDefinition(): nodeTypeDefinitionNode;
    getGrammarProgramRoot(): GrammarProgram;
    getWordTypes(): AbstractGrammarBackedCell<any>[];
    protected _getGrammarBackedCellArray(): AbstractGrammarBackedCell<any>[];
    getLineCellTypes(): string;
    getLineHighlightScopes(defaultScope?: string): string;
    getErrors(): jTreeTypes.TreeError[];
    protected _getCompiledIndentation(): any;
    protected _getCompiledLine(): string;
    compile(): string;
    readonly cells: jTreeTypes.stringMap;
}
declare class BlobNode extends GrammarBackedNonRootNode {
    createParser(): import("./base/Parser").default;
    getErrors(): jTreeTypes.TreeError[];
}
declare abstract class AbstractGrammarBackedCell<T> {
    constructor(node: GrammarBackedNonRootNode, index: jTreeTypes.int, typeDef: cellTypeDefinitionNode, cellTypeId: string, isCatchAll: boolean);
    private _node;
    protected _index: jTreeTypes.int;
    protected _word: string;
    private _typeDef;
    private _isCatchAll;
    private _cellTypeId;
    getCellTypeId(): string;
    static parserFunctionName: string;
    getNode(): GrammarBackedNonRootNode;
    getCellIndex(): number;
    isCatchAll(): boolean;
    abstract getParsed(): T;
    getHighlightScope(): string | undefined;
    getAutoCompleteWords(partialWord?: string): {
        text: string;
        displayText: string;
    }[];
    getWord(): string;
    protected _getCellTypeDefinition(): cellTypeDefinitionNode;
    protected _getFullLine(): string;
    protected _getErrorContext(): string;
    protected abstract _isValid(): boolean;
    isValid(): boolean;
    getErrorIfAny(): jTreeTypes.TreeError;
}
declare abstract class AbstractTreeError implements jTreeTypes.TreeError {
    constructor(node: GrammarBackedNode);
    private _node;
    getLineIndex(): jTreeTypes.positiveInt;
    getLineNumber(): jTreeTypes.positiveInt;
    isCursorOnWord(lineIndex: jTreeTypes.positiveInt, characterIndex: jTreeTypes.positiveInt): boolean;
    private _doesCharacterIndexFallOnWord;
    isBlankLineError(): boolean;
    isMissingWordError(): boolean;
    getIndent(): string;
    getCodeMirrorLineWidgetElement(onApplySuggestionCallBack?: () => void): HTMLDivElement;
    getNodeTypeId(): string;
    private _getCodeMirrorLineWidgetElementCellTypeHints;
    private _getCodeMirrorLineWidgetElementWithoutSuggestion;
    private _getCodeMirrorLineWidgetElementWithSuggestion;
    getLine(): string;
    getExtension(): string;
    getNode(): GrammarBackedNode;
    getErrorTypeName(): string;
    getCellIndex(): number;
    toObject(): {
        type: string;
        line: number;
        cell: number;
        suggestion: string;
        path: string;
        message: string;
    };
    hasSuggestion(): boolean;
    getSuggestionMessage(): string;
    toString(): string;
    applySuggestion(): void;
    getMessage(): string;
}
declare class UnknownNodeTypeError extends AbstractTreeError {
    getMessage(): string;
    protected _getWordSuggestion(): string;
    getSuggestionMessage(): string;
    applySuggestion(): this;
}
declare abstract class AbstractExtendibleTreeNode extends TreeNode {
    _getFromExtended(firstWordPath: jTreeTypes.firstWordPath): string;
    _getChildrenByNodeConstructorInExtended(constructor: Function): TreeNode[];
    _getExtendedParent(): AbstractExtendibleTreeNode;
    _hasFromExtended(firstWordPath: jTreeTypes.firstWordPath): boolean;
    _getNodeFromExtended(firstWordPath: jTreeTypes.firstWordPath): AbstractExtendibleTreeNode;
    _doesExtend(nodeTypeId: jTreeTypes.nodeTypeId): boolean;
    _getAncestorSet(): Set<string>;
    abstract _getId(): string;
    private _cache_ancestorSet;
    private _cache_ancestorsArray;
    _getAncestorsArray(cannotContainNodes?: AbstractExtendibleTreeNode[]): AbstractExtendibleTreeNode[];
    private _getIdThatThisExtends;
    abstract _getIdToNodeMap(): {
        [id: string]: AbstractExtendibleTreeNode;
    };
    protected _initAncestorsArrayCache(cannotContainNodes?: AbstractExtendibleTreeNode[]): void;
}
declare class cellTypeDefinitionNode extends AbstractExtendibleTreeNode {
    createParser(): import("./base/Parser").default;
    _getId(): string;
    _getIdToNodeMap(): {
        [name: string]: cellTypeDefinitionNode;
    };
    getGetter(wordIndex: number): string;
    getCatchAllGetter(wordIndex: number): string;
    getCellConstructor(): typeof AbstractGrammarBackedCell;
    private _getExtendedCellTypeId;
    getHighlightScope(): string | undefined;
    private _getEnumOptions;
    private _getEnumFromCellTypeOptions;
    _getRootProgramNode(): GrammarProgram;
    _getAutocompleteWordOptions(program: GrammarBackedRootNode): string[];
    getRegexString(): string;
    isValid(str: string, programRootNode: GrammarBackedRootNode): boolean;
    getCellTypeId(): jTreeTypes.cellTypeId;
    static types: any;
}
declare class GrammarExampleNode extends TreeNode {
}
declare abstract class GrammarNodeTypeConstant extends TreeNode {
    getGetter(): string;
    getIdentifier(): string;
    getConstantValueAsJsText(): string;
    getConstantValue(): any;
}
declare abstract class AbstractGrammarDefinitionNode extends AbstractExtendibleTreeNode {
    createParser(): import("./base/Parser").default;
    _getId(): string;
    getConstantsObject(): {
        [key: string]: GrammarNodeTypeConstant;
    };
    _getUniqueConstantNodes(extended?: boolean): {
        [key: string]: GrammarNodeTypeConstant;
    };
    getExamples(): GrammarExampleNode[];
    getNodeTypeIdFromDefinition(): jTreeTypes.nodeTypeId;
    _getGeneratedClassName(): string;
    _hasValidNodeTypeId(): boolean;
    _isAbstract(): boolean;
    private _cache_definedNodeConstructor;
    _getConstructorDefinedInGrammar(): Function;
    _getFirstWordMatch(): string;
    private _getNodeTypeIdWithoutNodeTypeSuffix;
    _getRegexMatch(): string;
    getLanguageDefinitionProgram(): GrammarProgram;
    protected _getCustomJavascriptMethods(): jTreeTypes.javascriptCode;
    private _cache_firstWordToNodeDefMap;
    getFirstWordMapWithDefinitions(): {
        [firstWord: string]: nodeTypeDefinitionNode;
    };
    getRunTimeFirstWordsInScope(): jTreeTypes.nodeTypeId[];
    getRequiredCellTypeIds(): jTreeTypes.cellTypeId[];
    _getCellGettersAndNodeTypeConstants(): string;
    getCatchAllCellTypeId(): jTreeTypes.cellTypeId | undefined;
    protected _createParserInfo(nodeTypeIdsInScope: jTreeTypes.nodeTypeId[]): parserInfo;
    getTopNodeTypeIds(): jTreeTypes.nodeTypeId[];
    protected _getMyInScopeNodeTypeIds(): jTreeTypes.nodeTypeId[];
    protected _getInScopeNodeTypeIds(): jTreeTypes.nodeTypeId[];
    isRequired(): boolean;
    getNodeTypeDefinitionByNodeTypeId(nodeTypeId: jTreeTypes.nodeTypeId): AbstractGrammarDefinitionNode;
    getFirstCellTypeId(): jTreeTypes.cellTypeId;
    isDefined(nodeTypeId: string): boolean;
    _getIdToNodeMap(): {
        [nodeTypeId: string]: nodeTypeDefinitionNode;
    };
    private _cache_isRoot;
    private _amIRoot;
    private _getLanguageRootNode;
    private _isErrorNodeType;
    private _isBlobNodeType;
    private _getErrorMethodToJavascript;
    private _getParserToJavascript;
    private _getCatchAllNodeConstructorToJavascript;
    _nodeDefToJavascriptClass(): jTreeTypes.javascriptCode;
    _getCompilerObject(): jTreeTypes.stringMap;
    getLineHints(): string;
    isOrExtendsANodeTypeInScope(firstWordsInScope: string[]): boolean;
    isTerminalNodeType(): boolean;
    private _getFirstCellHighlightScope;
    getMatchBlock(): string;
    private _cache_nodeTypeInheritanceSet;
    private _cache_ancestorNodeTypeIdsArray;
    _getNodeTypeInheritanceSet(): Set<string>;
    getAncestorNodeTypeIdsArray(): jTreeTypes.nodeTypeId[];
    protected _getProgramNodeTypeDefinitionCache(): {
        [nodeTypeId: string]: nodeTypeDefinitionNode;
    };
    getDescription(): string;
    getFrequency(): number;
    private _getExtendedNodeTypeId;
}
declare class nodeTypeDefinitionNode extends AbstractGrammarDefinitionNode {
}
declare class GrammarProgram extends AbstractGrammarDefinitionNode {
    createParser(): import("./base/Parser").default;
    static makeNodeTypeId: (str: string) => string;
    static makeCellTypeId: (str: string) => string;
    static nodeTypeSuffixRegex: RegExp;
    static cellTypeSuffixRegex: RegExp;
    private _cache_compiledLoadedNodeTypes;
    _getCompiledLoadedNodeTypes(): {
        [nodeTypeId: string]: Function;
    };
    private _importNodeJsRootNodeTypeConstructor;
    private _importBrowserRootNodeTypeConstructor;
    getErrorsInGrammarExamples(): jTreeTypes.TreeError[];
    getTargetExtension(): string;
    getNodeTypeOrder(): string;
    private _cache_cellTypes;
    getCellTypeDefinitions(): {
        [name: string]: cellTypeDefinitionNode;
    };
    getCellTypeDefinitionById(cellTypeId: jTreeTypes.cellTypeId): cellTypeDefinitionNode;
    getNodeTypeFamilyTree(): TreeNode;
    protected _getCellTypeDefinitions(): {
        [typeName: string]: cellTypeDefinitionNode;
    };
    getLanguageDefinitionProgram(): this;
    getValidConcreteAndAbstractNodeTypeDefinitions(): nodeTypeDefinitionNode[];
    private _cache_rootNodeTypeNode;
    _getRootNodeTypeDefinitionNode(): nodeTypeDefinitionNode;
    _addDefaultCatchAllBlobNode(): void;
    getExtensionName(): string;
    getGrammarName(): string | undefined;
    protected _getMyInScopeNodeTypeIds(): jTreeTypes.nodeTypeId[];
    protected _getInScopeNodeTypeIds(): jTreeTypes.nodeTypeId[];
    private _cache_nodeTypeDefinitions;
    protected _initProgramNodeTypeDefinitionCache(): void;
    _getProgramNodeTypeDefinitionCache(): {
        [nodeTypeId: string]: nodeTypeDefinitionNode;
    };
    static _languages: any;
    static _nodeTypes: any;
    private _getRootConstructor;
    private _cache_rootConstructorClass;
    getRootConstructor(): AbstractRuntimeProgramConstructorInterface;
    private _getFileExtensions;
    toNodeJsJavascript(jtreePath?: string): jTreeTypes.javascriptCode;
    toBrowserJavascript(): jTreeTypes.javascriptCode;
    private _getProperName;
    private _rootNodeDefToJavascriptClass;
    toSublimeSyntaxFile(): string;
}
export { GrammarConstants, PreludeCellTypeIds, GrammarProgram, GrammarBackedRootNode, GrammarBackedNonRootNode };
