const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

/**
 * LEXER
 */

const enum TokenType {
  Monkey = 'Monkey',
  Space = 'Space',
  Number = 'Number',
  Comma = 'Comma',
  New = 'New',
  Old = 'Old',
  StartingItems = 'Starting items',
  AssignmentOperator = 'AssignmentOperator',
  Operation = 'Operation',
  Test = 'Test',
  DivisibleBy = 'DivisibleBy',
  ArithMetic = 'Arithmetic',
  If = 'If',
  True = 'True',
  False = 'False',
  Colon = 'Colon',
  Literal = 'Literal',
  ThrowTo = 'ThrowTo',
  LineBreak = 'LineBreak'
}

interface TokenNode<T extends TokenType> {
  type: T
}

interface TokenValueNode<T extends TokenType, V> extends TokenNode<T> {
  value: V
}

type Token =
  | TokenNode<TokenType.Monkey>
  | TokenNode<TokenType.StartingItems>
  | TokenNode<TokenType.Operation>
  | TokenNode<TokenType.Space>
  | TokenNode<TokenType.DivisibleBy>
  | TokenNode<TokenType.Colon>
  | TokenNode<TokenType.Comma>
  | TokenNode<TokenType.AssignmentOperator>
  | TokenNode<TokenType.New>
  | TokenNode<TokenType.Old>
  | TokenNode<TokenType.True>
  | TokenNode<TokenType.False>
  | TokenNode<TokenType.Test>
  | TokenNode<TokenType.If>
  | TokenNode<TokenType.ThrowTo>
  | TokenNode<TokenType.LineBreak>
  | TokenValueNode<TokenType.Number, number>
  | TokenValueNode<TokenType.ArithMetic, '+' | '-' | '*' | '/'>

class Lexer {
  #pos = 0;
  #tokenStringMap: Record<string, Token> =
    {
      'throw to monkey': { type: TokenType.ThrowTo },
      'Monkey': { type: TokenType.Monkey },
      'Starting items': { type: TokenType.StartingItems },
      'Operation': { type: TokenType.Operation },
      'new': { type: TokenType.New },
      'old': { type: TokenType.Old },
      'true': { type: TokenType.True },
      'false': { type: TokenType.False },
      'divisible by': { type: TokenType.DivisibleBy },
      ' ': { type: TokenType.Space },
      ':': { type: TokenType.Colon },
      ',': { type: TokenType.Comma },
      '=': { type: TokenType.AssignmentOperator },
      'Test': { type: TokenType.Test },
      'If': { type: TokenType.If },
      '\n': { type: TokenType.LineBreak }
    }

  constructor(private readonly input: string) { }

  tokenise() {
    const result: Token[] = []
    while (this.#pos < this.input.length) {
      let foundMatch = false
      for (const [key, value] of Object.entries(this.#tokenStringMap)) {
        if (this.#lookaheadToken(key)) {
          foundMatch = true
          this.#pos += key.length
          result.push(value)
          continue;
        }
      }

      if (foundMatch) continue;

      const strValue = this.#lookaheadNumber()
      if (strValue.length) {
        const value = +strValue
        foundMatch = true
        this.#pos += strValue.length
        result.push({ type: TokenType.Number, value })
      }

      if (foundMatch) continue;

      if (['+', '-', '*', '/'].includes(this.input[this.#pos])) {
        foundMatch = true
        result.push({ type: TokenType.ArithMetic, value: this.input[this.#pos] as any })
        ++this.#pos
      }

      if (foundMatch) continue;

      console.log(result)
      throw new Error("Lexing failed")
    }
    return result;
  }

  #lookaheadToken(tok: string) {
    let match = true
    tok.split('').forEach((char, idx) => {
      if (char !== this.input.charAt(this.#pos + idx)) {
        match = false
      }
    })
    return match
  }

  #lookaheadNumber() {
    let scanPos = 0
    let buffer = ''
    let scanComplete = false
    do {
      const curChar = this.input[this.#pos + scanPos]
      if (/\d/.test(curChar)) {
        buffer += this.input[this.#pos + scanPos]
      } else {
        scanComplete = true
      }
      ++scanPos
    } while (!scanComplete)

    return buffer;
  }
}

/**
 * PARSER
 */

enum ASTNodeType {
  Program = 'Program',
  MonkeyDefinition = 'MonkeyDefinition',
  Operation = 'Operation',
  Test = 'Test',
  ConditionalThrow = 'Throw',
  Literal = 'Literal',
  LiteralArray = 'LiteralArray',
}

interface ASTValueNode<T extends ASTNodeType, K> {
  type: T,
  value: K
}

interface ASTProgramNode {
  type: ASTNodeType.Program,
  children: ASTNode[]
}

interface ASTMonkeyDefinition {
  type: ASTNodeType.MonkeyDefinition
  startingItems: 
}

interface ASTAssignmentNode {
  type: ASTNodeType.Assignment,
  name: string,
  value: ASTNode
}

interface ASTLogNode {
  type: ASTNodeType.Log,
  children: ASTNode[]
}

type ASTNode =
  ASTValueNode<ASTNodeType.String, string> |
  ASTValueNode<ASTNodeType.Literal, string> |
  ASTProgramNode |
  ASTAssignmentNode |
  ASTLogNode

const lexer = new Lexer(input)
console.log(lexer.tokenise())
