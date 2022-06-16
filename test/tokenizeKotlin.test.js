import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeKotlin.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    stack: [],
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize('').toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keyword', () => {
  // see https://www.programiz.com/kotlin-programming/keywords-identifiers
  expectTokenize('as').toEqual(TokenType.Keyword)
  expectTokenize('break').toEqual(TokenType.Keyword)
  expectTokenize('class').toEqual(TokenType.Keyword)
  expectTokenize('continue').toEqual(TokenType.Keyword)
  expectTokenize('do').toEqual(TokenType.Keyword)
  expectTokenize('else').toEqual(TokenType.Keyword)
  expectTokenize('false').toEqual(TokenType.Keyword)
  expectTokenize('for').toEqual(TokenType.Keyword)
  expectTokenize('fun').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.Keyword)
  expectTokenize('in').toEqual(TokenType.Keyword)
  expectTokenize('interface').toEqual(TokenType.Keyword)
  expectTokenize('is').toEqual(TokenType.Keyword)
  expectTokenize('null').toEqual(TokenType.Keyword)
  expectTokenize('object').toEqual(TokenType.Keyword)
  expectTokenize('package').toEqual(TokenType.Keyword)
  expectTokenize('return').toEqual(TokenType.Keyword)
  expectTokenize('super').toEqual(TokenType.Keyword)
  expectTokenize('this').toEqual(TokenType.Keyword)
  expectTokenize('throw').toEqual(TokenType.Keyword)
  expectTokenize('true').toEqual(TokenType.Keyword)
  expectTokenize('try').toEqual(TokenType.Keyword)
  expectTokenize('typealias').toEqual(TokenType.Keyword)
  expectTokenize('typeof').toEqual(TokenType.Keyword)
  expectTokenize('val').toEqual(TokenType.Keyword)
  expectTokenize('var').toEqual(TokenType.Keyword)
  expectTokenize('when').toEqual(TokenType.Keyword)
  expectTokenize('while').toEqual(TokenType.Keyword)
})

test('string', () => {
  expectTokenize(`"Hello World"`).toEqual(
    TokenType.PunctuationString,
    TokenType.String,
    TokenType.PunctuationString
  )
})

test('assignment', () => {
  expectTokenize(`x = 42`).toEqual(
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('function', () => {
  expectTokenize(`fun main(args : Array<String>) {}`).toEqual(
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})
