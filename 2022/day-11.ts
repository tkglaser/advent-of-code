import { Lexer } from "./day-11/lexer";
import {
  ASTArithmetic,
  ASTDivisibilityTest,
  ASTLiteral,
  ASTMonkeyDefinition,
  ASTNodeType,
  ASTStartingItems,
  ASTThrowCondition,
  Parser,
} from "./day-11/parser";

const input = `<input>`;

const lexer = new Lexer(input);
const tokens = lexer.tokenise();

const parser = new Parser(tokens);
const ast = parser.parse();

class Monkey {
  public readonly items: number[] = [];
  public readonly id: number;
  public readonly opLeft: number | "old";
  public readonly op: "+" | "-" | "*" | "/";
  public readonly opRight: number | "old";
  public readonly divisibilityTestValue: number;
  public readonly onTrueThrowTo: number;
  public readonly onFalseThrowTo: number;
  public itemsInspected = 0;
  public modulo = 1;

  constructor(
    definition: ASTMonkeyDefinition,
    private onThrow: (to: number, item: number) => void,
    private readonly chillMode: boolean
  ) {
    this.id = parser.find<ASTLiteral>(
      definition.children,
      ASTNodeType.Literal
    )?.value!;

    const startingItemNodes = parser.find<ASTStartingItems>(
      definition.children,
      ASTNodeType.StartingItems
    )?.children!;

    this.items = startingItemNodes.map((item) => (item as ASTLiteral).value);

    const arithmetic = parser.find<ASTArithmetic>(
      definition.children,
      ASTNodeType.Arithmetic
    )!;

    this.opLeft =
      arithmetic.left.type === ASTNodeType.OldValue
        ? "old"
        : (arithmetic.left as ASTLiteral).value;
    this.op = arithmetic.operator.operator;
    this.opRight =
      arithmetic.right.type === ASTNodeType.OldValue
        ? "old"
        : (arithmetic.right as ASTLiteral).value;

    const divisibilityTest = parser.find<ASTDivisibilityTest>(
      definition.children,
      ASTNodeType.DivisibilityTest
    )!;

    this.divisibilityTestValue = (divisibilityTest.value as ASTLiteral).value;
    this.onTrueThrowTo = (
      divisibilityTest.throwConditions.find(
        (cond) => (cond as ASTThrowCondition).on === true
      ) as ASTThrowCondition
    ).throwTo;

    this.onFalseThrowTo = (
      divisibilityTest.throwConditions.find(
        (cond) => (cond as ASTThrowCondition).on === false
      ) as ASTThrowCondition
    ).throwTo;
  }

  playRound() {
    // console.log(`Monkey ${this.id}:`);
    while (this.items.length) {
      ++this.itemsInspected;
      const item = this.items.shift()!;
      // console.log(`  Monkey inspects an item with a worry level of ${item}.`);
      let worry = this.calculateWorry(item);
      // console.log(`    Worry level has reached ${worry}.`);
      if (this.chillMode) {
        // gets bored
        worry = Math.floor(worry / 3);
        // console.log(
        //   `    Monkey gets bored with item. Worry level is divided by 3 to ${worry}.`
        // );
      } else {
        worry = worry % this.modulo;
      }
      const isDivisible = worry % this.divisibilityTestValue === 0;
      if (isDivisible) {
        // console.log(
        //   `    Current worry level is divisible by ${this.divisibilityTestValue}.`
        // );
        // console.log(
        //   `    Item with worry level ${worry} is thrown to monkey ${this.onTrueThrowTo}.`
        // );
        this.throw(this.onTrueThrowTo, worry);
      } else {
        // console.log(
        //   `    Current worry level is not divisible by ${this.divisibilityTestValue}.`
        // );
        // console.log(
        //   `    Item with worry level ${worry} is thrown to monkey ${this.onFalseThrowTo}.`
        // );
        this.throw(this.onFalseThrowTo, worry);
      }
    }
  }

  catchItem(item: number) {
    this.items.push(item);
  }

  throw(to: number, item: number) {
    this.onThrow(to, item);
  }

  printInventory() {
    console.log(`Monkey ${this.id}: ${this.items.join(", ")}`);
  }

  printActivity() {
    console.log(
      `Monkey ${this.id} inspected items ${this.itemsInspected} times.`
    );
  }

  private calculateWorry(item: number) {
    const opRight = this.opRight === "old" ? item : this.opRight;
    const opLeft = this.opLeft === "old" ? item : this.opLeft;
    switch (this.op) {
      case "+":
        return opLeft + opRight;
      case "-":
        return opLeft - opRight;
      case "*":
        return opLeft * opRight;
      case "/":
        return opLeft / opRight;
    }
  }
}

function part1() {
  const slingShot = (to: number, item: number) => {
    monkeys[to].catchItem(item);
  };
  const monkeys = ast.children.map(
    (definition) =>
      new Monkey(definition as ASTMonkeyDefinition, slingShot, true)
  );

  for (let round = 0; round < 20; ++round) {
    for (const monkey of monkeys) {
      monkey.playRound();
    }
  }

  for (const monkey of monkeys) {
    monkey.printActivity();
  }
}

function part2() {
  const slingShot = (to: number, item: number) => {
    monkeys[to].catchItem(item);
  };
  const monkeys = ast.children.map(
    (definition) =>
      new Monkey(definition as ASTMonkeyDefinition, slingShot, false)
  );

  const modulo = monkeys.reduce(
    (mod, monkey) => mod * monkey.divisibilityTestValue,
    1
  );

  for (const monkey of monkeys) {
    monkey.modulo = modulo;
  }

  for (let round = 0; round < 10000; ++round) {
    for (const monkey of monkeys) {
      monkey.playRound();
    }
  }

  for (const monkey of monkeys) {
    monkey.printActivity();
  }
}

part2();
