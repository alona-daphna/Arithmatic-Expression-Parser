import { ASTNode } from '../types/parser';
import { TokenType } from '../types/tokenizer';
import { Parser } from './parser';
import { Tokenizer } from './tokenizer';

export default (exp: string) => {
  const tokenizer = new Tokenizer(exp);
  const parser = new Parser(tokenizer);
  const ast = parser.parse();

  return evaluate(ast);
};

const operations: { [key: string]: (a: number, b: number) => number } = {
  Add: (a: number, b: number) => a + b,
  Subtract: (a: number, b: number) => a - b,
  Multiply: (a: number, b: number) => a * b,
  Divide: (a: number, b: number) => a / b,
  Power: (a: number, b: number) => a ** b,
};

const evaluate = (node: ASTNode): number => {
  // base case
  if (node.type === TokenType.Number) {
    return parseFloat(node.value);
  }

  const leftValue = evaluate(node.left!);
  const rightValue = evaluate(node.right!);

  return operations[node.type](leftValue, rightValue);
};
