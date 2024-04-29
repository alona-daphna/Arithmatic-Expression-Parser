import { Token, TokenType } from '../types/tokenizer';

const operators: { [key: string]: TokenType } = {
  '+': TokenType.Add,
  '-': TokenType.Subtract,
  '*': TokenType.Multiply,
  '/': TokenType.Divide,
  '^': TokenType.Power,
};

export class Tokenizer {
  input: string;
  pos: number;
  private prevTokenValue: string;
  private regexMap: Map<RegExp, () => Token>;
  private endOfNumber: number | null;

  constructor(input: string) {
    this.input = input.replace(/\s/g, '');
    this.pos = 0;
    this.prevTokenValue = '';
    this.regexMap = new Map<RegExp, () => Token>();
    this.regexMap.set(/\d/, this.processNumber);
    this.regexMap.set(/-/, this.processNegativeSign);
    this.regexMap.set(/[\+\/\*\^]/, this.processOperator);
    this.regexMap.set(/\(/, this.processLeftParen);
    this.regexMap.set(/\)/, this.processRightParen);
    this.endOfNumber = null;
  }

  consume = (): Token => {
    const token = this.peek();
    this.prevTokenValue = token.value;
    this.pos = this.endOfNumber ?? this.pos + 1;
    this.endOfNumber = null;
    return token;
  };

  peek = (): Token => {
    if (this.pos >= this.input.length) {
      return {
        type: TokenType.EOF,
        value: '',
      };
    }

    for (const [regex, processFn] of this.regexMap) {
      const match = this.input.charAt(this.pos).match(regex);
      if (match) {
        return processFn();
      }
    }

    throw Error(
      `Invalid token '${this.input.charAt(this.pos)}' at position ${this.pos}`
    );
  };

  private processNumber = (negative = false): Token => {
    let index = negative ? this.pos + 1 : this.pos;

    if (!this.input.charAt(index).match(/\d/)) {
      throw Error(
        `invalid token '${this.input.charAt(index)}' at position ${index}`
      );
    }

    let decimalPoint = 0;
    let number = '';

    while (
      index < this.input.length &&
      this.input.charAt(index).match(/[\d\.]/) &&
      decimalPoint <= 1
    ) {
      if (this.input.charAt(index) === '.') {
        decimalPoint++;
      }

      number += this.input.charAt(index);
      index++;
    }

    if (decimalPoint > 1) {
      throw Error(
        `invalid token '${this.input.charAt(index - 1)}' at position ${
          index - 1
        }`
      );
    }

    this.endOfNumber = index;

    return {
      type: TokenType.Number,
      value: negative ? '-' + number : number,
    };
  };

  private processLeftParen = (): Token => {
    return {
      type: TokenType.LParen,
      value: this.input.charAt(this.pos),
    };
  };

  private processRightParen = (): Token => {
    return {
      type: TokenType.RParen,
      value: this.input.charAt(this.pos),
    };
  };

  private processOperator = (): Token => {
    return {
      type: operators[this.input.charAt(this.pos)],
      value: this.input.charAt(this.pos),
    };
  };

  private processNegativeSign = (): Token => {
    if (this.prevTokenValue === '' || this.prevTokenValue.match(/[+-\/\*\^]/)) {
      return this.processNumber(true);
    }

    return this.processOperator();
  };
}
