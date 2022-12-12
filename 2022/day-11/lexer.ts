export const enum TokenType {
    Monkey = "Monkey",
    Number = "Number",
    Comma = "Comma",
    New = "New",
    Old = "Old",
    StartingItems = "Starting items",
    AssignmentOperator = "AssignmentOperator",
    Operation = "Operation",
    Test = "Test",
    DivisibleBy = "DivisibleBy",
    ArithMetic = "Arithmetic",
    If = "If",
    True = "True",
    False = "False",
    Colon = "Colon",
    Literal = "Literal",
    ThrowTo = "ThrowTo",
    EmptyLine = "EmptyLine",
    LineBreak = "LineBreak",
  }
  
  export interface TokenNode<T extends TokenType> {
    type: T;
  }
  
  export interface TokenValueNode<T extends TokenType, V> extends TokenNode<T> {
    value: V;
  }
  
  export type Token =
    | TokenNode<TokenType.Monkey>
    | TokenNode<TokenType.StartingItems>
    | TokenNode<TokenType.Operation>
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
    | TokenNode<TokenType.EmptyLine>
    | TokenNode<TokenType.LineBreak>
    | TokenValueNode<TokenType.Number, number>
    | TokenValueNode<TokenType.ArithMetic, "+" | "-" | "*" | "/">;
  
  export class Lexer {
    #pos = 0;
    #tokenStringMap: Record<string, Token> = {
      "throw to monkey": { type: TokenType.ThrowTo },
      Monkey: { type: TokenType.Monkey },
      "Starting items": { type: TokenType.StartingItems },
      Operation: { type: TokenType.Operation },
      new: { type: TokenType.New },
      old: { type: TokenType.Old },
      true: { type: TokenType.True },
      false: { type: TokenType.False },
      "divisible by": { type: TokenType.DivisibleBy },
      ":": { type: TokenType.Colon },
      ",": { type: TokenType.Comma },
      "=": { type: TokenType.AssignmentOperator },
      Test: { type: TokenType.Test },
      If: { type: TokenType.If },
      "\n": { type: TokenType.LineBreak },
    };
  
    constructor(private readonly input: string) {}
  
    tokenise() {
      const result: Token[] = [];
      while (this.#pos < this.input.length) {
        let foundMatch = false;
  
        if (this.input[this.#pos] === " ") {
          ++this.#pos;
          continue;
        }
  
        if (this.#lookaheadToken("\n\n")) {
          foundMatch = true;
          this.#pos += 2;
          result.push(
            { type: TokenType.LineBreak },
            { type: TokenType.EmptyLine },
            { type: TokenType.LineBreak }
          );
          continue;
        }
  
        for (const [key, value] of Object.entries(this.#tokenStringMap)) {
          if (this.#lookaheadToken(key)) {
            foundMatch = true;
            this.#pos += key.length;
            result.push(value);
            continue;
          }
        }
  
        if (foundMatch) continue;
  
        const strValue = this.#lookaheadNumber();
        if (strValue.length) {
          const value = +strValue;
          foundMatch = true;
          this.#pos += strValue.length;
          result.push({ type: TokenType.Number, value });
        }
  
        if (foundMatch) continue;
  
        if (["+", "-", "*", "/"].includes(this.input[this.#pos])) {
          foundMatch = true;
          result.push({
            type: TokenType.ArithMetic,
            value: this.input[this.#pos] as any,
          });
          ++this.#pos;
        }
  
        if (foundMatch) continue;
  
        console.log(result);
        throw new Error("Lexing failed");
      }
      return result;
    }
  
    #lookaheadToken(tok: string) {
      let match = true;
      tok.split("").forEach((char, idx) => {
        if (char !== this.input.charAt(this.#pos + idx)) {
          match = false;
        }
      });
      return match;
    }
  
    #lookaheadNumber() {
      let scanPos = 0;
      let buffer = "";
      let scanComplete = false;
      do {
        const curChar = this.input[this.#pos + scanPos];
        if (/\d/.test(curChar)) {
          buffer += this.input[this.#pos + scanPos];
        } else {
          scanComplete = true;
        }
        ++scanPos;
      } while (!scanComplete);
  
      return buffer;
    }
  }
  