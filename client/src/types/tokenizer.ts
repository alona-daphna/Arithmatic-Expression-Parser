export enum TokenType {
  Number = 'Number',
  Divide = 'Divide',
  Multiply = 'Multiply',
  Power = 'Power',
  Subtract = 'Subtract',
  Add = 'Add',
  LParen = 'LParen',
  RParen = 'RParen',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
}

export interface Tokenizer {
  peek(): Token;
  consume(): Token;
  pos: number;
  input: string;
}
