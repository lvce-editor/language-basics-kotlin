/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  InsideString: 2,
  InsideBlockComment: 10,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
}

/**
 * @enum number
 */
export const TokenType = {
  None: 1,
  Whitespace: 2,
  PunctuationString: 3,
  String: 4,
  Keyword: 5,
  Numeric: 6,
  Punctuation: 7,
  VariableName: 8,
  Comment: 60,
  Error: 141,
  NewLine: 771,
  LanguageConstant: 13,
  Regex: 14,
  KeywordImport: 215,
  KeywordControl: 881,
  KeywordModifier: 882,
  KeywordReturn: 883,
  KeywordNew: 884,
  FunctionName: 885,
  KeywordThis: 886,
  KeywordOperator: 887,
  KeywordFunction: 889,
  Class: 890,
  KeywordVoid: 891,
}

export const TokenMap = {
  [TokenType.None]: 'None',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.PunctuationString]: 'PunctuationString',
  [TokenType.String]: 'String',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.Comment]: 'Comment',
  [TokenType.Error]: 'Error',
  [TokenType.PunctuationString]: 'PunctuationString',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.LanguageConstant]: 'LanguageConstant',
  [TokenType.Regex]: 'Regex',
  [TokenType.KeywordImport]: 'KeywordImport',
  [TokenType.KeywordControl]: 'KeywordControl',
  [TokenType.KeywordModifier]: 'KeywordModifier',
  [TokenType.KeywordReturn]: 'KeywordReturn',
  [TokenType.KeywordNew]: 'KeywordNew',
  [TokenType.FunctionName]: 'Function',
  [TokenType.KeywordThis]: 'KeywordThis',
  [TokenType.KeywordOperator]: 'KeywordOperator',
  [TokenType.KeywordFunction]: 'KeywordFunction',
  [TokenType.KeywordVoid]: 'KeywordVoid',
  [TokenType.Class]: 'Class',
}

const RE_SELECTOR = /^[\.a-zA-Z\d\-\:>]+/
const RE_WHITESPACE = /^ +/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[a-zA-Z\-]+\b/
const RE_COLON = /^:/
const RE_PROPERTY_VALUE = /^[^;\}]+/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING = /^.+/s
const RE_ANYTHING_UNTIL_CLOSE_BRACE = /^[^\}]+/
const RE_QUOTE_DOUBLE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_KEYWORD =
  /^(?:while|when|var|val|typeof|typealias|try|true|throw|this|super|return|package|object|null|is|interface|in|if|fun|for|false|else|do|continue|class|break|as|enum|String)\b/

const RE_VARIABLE_NAME = /^[a-zA-Z\_\$]+/
const RE_NUMERIC = /^\d+/
const RE_LINE_COMMENT = /^\/\/[^\n]*/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/)/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_ANYTHING_UNTIL_END = /^.+/s
const RE_PUNCTUATION = /^[\(\)=\+\-><\.:;\{\}\[\]!,&\|\^\?\*%~]/
const RE_SLASH = /^\//

export const initialLineState = {
  state: State.TopLevelContent,
  /**
   * @type {any[]}
   */
  tokens: [],
}

export const hasArrayReturn = true

/**
 *
 * @param {any} lineStateA
 * @param {*} lineStateB
 * @returns
 */
export const isEqualLineState = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_KEYWORD))) {
          switch (next[0]) {
            case 'true':
            case 'false':
            case 'null':
              token = TokenType.LanguageConstant
              state = State.TopLevelContent
              break
            case 'switch':
            case 'default':
            case 'case':
            case 'else':
            case 'if':
            case 'break':
            case 'throw':
            case 'for':
            case 'try':
            case 'catch':
            case 'finally':
            case 'continue':
            case 'when':
            case 'while':
            case 'do':
            case 'in':
              token = TokenType.KeywordControl
              state = State.TopLevelContent
              break
            case 'return':
              token = TokenType.KeywordReturn
              state = State.TopLevelContent
              break
            case 'new':
              token = TokenType.KeywordNew
              state = State.TopLevelContent
              break
            case 'this':
              token = TokenType.KeywordThis
              state = State.TopLevelContent
              break
            case 'fun':
              token = TokenType.KeywordFunction
              state = State.TopLevelContent
              break
            case 'Infinity':
              token = TokenType.Numeric
              state = State.TopLevelContent
              break
            case 'of':
              token = TokenType.Keyword
              state = State.TopLevelContent
              break
            case 'class':
            case 'extends':
              token = TokenType.Keyword
              state = State.TopLevelContent
              break
            case 'var':
            case 'val':
              token = TokenType.Keyword
              state = State.TopLevelContent
              break
            default:
              token = TokenType.Keyword
              state = State.TopLevelContent
              break
          }
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.VariableName
          state = State.TopLevelContent
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.TopLevelContent
        } else if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.PunctuationString
          state = State.InsideString
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else if ((next = part.match(RE_BLOCK_COMMENT_START))) {
          token = TokenType.Comment
          state = State.InsideBlockComment
        } else if ((next = part.match(RE_SLASH))) {
          if ((next = part.match(RE_BLOCK_COMMENT_START))) {
            token = TokenType.Comment
            state = State.InsideBlockComment
          } else if ((next = part.match(RE_LINE_COMMENT))) {
            token = TokenType.Comment
            state = State.TopLevelContent
          } else {
            next = part.match(RE_SLASH)
            token = TokenType.Punctuation
            state = State.TopLevelContent
          }
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideString:
        if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.PunctuationString
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideBlockComment:
        if ((next = part.match(RE_BLOCK_COMMENT_END))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else if ((next = part.match(RE_BLOCK_COMMENT_CONTENT))) {
          token = TokenType.Comment
          state = State.InsideBlockComment
        } else if ((next = part.match(RE_ANYTHING_UNTIL_END))) {
          token = TokenType.Comment
          state = State.InsideBlockComment
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
  }
}
