import { Token, TokenArithmeticNode, TokenNumberNode, TokenType, TokenValueNode } from "./lexer";

export enum ASTNodeType {
  Program = "Program",
  MonkeyDefinition = "MonkeyDefinition",
  StartingItems = "StartingItems",
  Operation = "Operation",
  DivisibilityTest = "DivisibilityTest",
  ConditionalThrow = "Throw",
  Literal = "Literal",
  Arithmetic = "Arithmetic",
  OldValue = "Old",
  Operator = "Operator",
  ThrowCondition = "ThrowCondition",
}

export interface ASTValueNode<T extends ASTNodeType, K> {
  type: T;
  value: K;
}

export interface ASTProgramNode {
  type: ASTNodeType.Program;
  children: ASTNode[];
}

export interface ASTMonkeyDefinition {
  type: ASTNodeType.MonkeyDefinition;
  children: ASTNode[];
}

export interface ASTStartingItems {
  type: ASTNodeType.StartingItems;
  children: ASTNode[];
}

export interface ASTOperation {
  type: ASTNodeType.Operation;
  children: ASTNode[];
}

export interface ASTArithmetic {
  type: ASTNodeType.Arithmetic;
  right: ASTNode;
  operator: ASTOperator;
  left: ASTNode;
}

export interface ASTOperator {
  type: ASTNodeType.Operator;
  operator: "+" | "-" | "*" | "/";
}

export interface ASTDivisibilityTest {
  type: ASTNodeType.DivisibilityTest;
  value: ASTNode;
  throwConditions: ASTNode[];
}

export interface ASTThrowCondition {
  type: ASTNodeType.ThrowCondition;
  on: boolean;
  throwTo: number;
}

export interface ASTOldValue {
  type: ASTNodeType.OldValue;
}

export type ASTLiteral = ASTValueNode<ASTNodeType.Literal, number>;

export type ASTNode =
  | ASTLiteral
  | ASTProgramNode
  | ASTMonkeyDefinition
  | ASTStartingItems
  | ASTOperation
  | ASTArithmetic
  | ASTOldValue
  | ASTDivisibilityTest
  | ASTThrowCondition
  | ASTOperator;

export class Parser {
  #pos = 0;
  constructor(private readonly tokens: Token[]) { }

  parse(): ASTProgramNode {
    const process = (): ASTNode | undefined => {
      const currentToken = this.tokens[this.#pos];

      const is = (type: TokenType) => currentToken.type === type;
      const isIn = (...types: TokenType[]) => types.includes(currentToken.type);

      if (is(TokenType.Monkey)) {
        let nextNode = this.tokens[this.#pos++];

        const children: ASTNode[] = [];

        while (nextNode && nextNode.type !== TokenType.EmptyLine) {
          const next = process();

          if (next) {
            children.push(next);
          }

          nextNode = this.tokens[this.#pos];
        }

        return {
          type: ASTNodeType.MonkeyDefinition,
          children,
        };
      }

      if (is(TokenType.StartingItems)) {
        let nextNode = this.tokens[this.#pos++];

        const children: ASTNode[] = [];

        while (nextNode.type !== TokenType.LineBreak) {
          const next = process();

          if (next) {
            children.push(next);
          }

          nextNode = this.tokens[this.#pos];
        }

        return {
          type: ASTNodeType.StartingItems,
          children,
        };
      }

      if (is(TokenType.Operation)) {
        ++this.#pos;
        const [, , , left, op, right] = [
          process(),
          process(),
          process(),
          process(),
          process(),
          process(),
        ];

        if (!left) {
          throw new Error("!left");
        }

        if (!right) {
          throw new Error("!right");
        }

        if (op?.type !== ASTNodeType.Operator) {
          throw new Error("!Operator");
        }

        return {
          type: ASTNodeType.Arithmetic,
          left,
          operator: op,
          right,
        };
      }

      if (is(TokenType.Test)) {
        ++this.#pos;

        let value: ASTNode | undefined;
        do {
          value = process();
        } while (value?.type !== ASTNodeType.Literal);

        if (!value) throw new Error("!value");

        let throwConditions: ASTNode[] = [];
        do {
          const c = process();
          if (c) throwConditions.push(c);
        } while (throwConditions.length < 2);

        return {
          type: ASTNodeType.DivisibilityTest,
          value,
          throwConditions,
        };
      }

      if (is(TokenType.If)) {
        const lineTokens: Token[] = [];
        while (
          this.tokens[this.#pos] &&
          this.tokens[this.#pos].type !== TokenType.LineBreak
        ) {
          lineTokens.push(this.tokens[this.#pos]);
          ++this.#pos;
        }
        return {
          type: ASTNodeType.ThrowCondition,
          on: lineTokens[1].type === TokenType.True,
          throwTo: (lineTokens[4] as TokenValueNode<TokenType.Number, number>)
            .value,
        };
      }

      if (isIn(
        TokenType.Colon,
        TokenType.New,
        TokenType.AssignmentOperator,
        TokenType.Comma,
        TokenType.LineBreak,
        TokenType.EmptyLine,
        TokenType.DivisibleBy,)
      ) {
        ++this.#pos;
        return undefined;
      }

      if (is(TokenType.Old)) {
        ++this.#pos;
        return {
          type: ASTNodeType.OldValue,
        };
      }

      if (is(TokenType.Arithmetic)) {
        ++this.#pos;
        return {
          type: ASTNodeType.Operator,
          operator: (currentToken as TokenArithmeticNode).value,
        };
      }

      if (is(TokenType.Number)) {
        ++this.#pos;
        return {
          type: ASTNodeType.Literal,
          value: (currentToken as TokenNumberNode).value,
        };
      }

      console.log(currentToken);

      throw new Error("Parsing failed");
    };

    const children: ASTNode[] = [];

    while (this.#pos < this.tokens.length) {
      const next = process();

      if (next) {
        children.push(next);
      }
    }

    return {
      type: ASTNodeType.Program,
      children,
    };
  }

  find<T>(items: ASTNode[], type: ASTNodeType): T | undefined {
    return items.find((item) => item.type === type) as T;
  }
}
