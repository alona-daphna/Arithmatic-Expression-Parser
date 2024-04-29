import { ASTNode } from '../types/parser';
import { TokenType, Tokenizer } from '../types/tokenizer';

export class Parser {
  private tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
  }

  // parses a string into an AST
  parse() {
    return this.parseExpression();
  }

  private parseExpression = (): ASTNode => {
    let product = this.parseProduct();

    let nextToken = this.tokenizer.peek();

    while (
      this.tokenizer.peek().type === TokenType.Add ||
      this.tokenizer.peek().type === TokenType.Subtract
    ) {
      this.tokenizer.consume();
      let nextProduct = this.parseProduct();

      if (nextToken.type === TokenType.Add) {
        product = {
          type: TokenType.Add,
          value: '+',
          left: product,
          right: nextProduct,
        };
      } else {
        product = {
          type: TokenType.Subtract,
          value: '-',
          left: product,
          right: nextProduct,
        };
      }
    }

    return product;
  };

  private parseProduct = () => {
    let power = this.parsePower();

    let nextToken = this.tokenizer.peek();

    if (
      nextToken.type === TokenType.Multiply ||
      nextToken.type === TokenType.Divide
    ) {
      this.tokenizer.consume();
      let nextPower = this.parsePower();

      if (nextToken.type === TokenType.Multiply) {
        power = {
          type: TokenType.Multiply,
          value: '*',
          left: power,
          right: nextPower,
        };
      } else {
        power = {
          type: TokenType.Divide,
          value: '/',
          left: power,
          right: nextPower,
        };
      }
    }

    return power;
  };

  private parsePower = (): ASTNode => {
    let factor = this.parseFactor();

    let nextToken = this.tokenizer.peek();

    if (nextToken.type === TokenType.Power) {
      this.tokenizer.consume();
      let nextFactor = this.parseFactor();

      if (nextFactor == null) {
        throw new Error('Expected an exponent');
      }

      return {
        type: TokenType.Power,
        value: '^',
        left: factor,
        right: nextFactor,
      };
    }

    return factor;
  };

  private parseFactor = (): ASTNode => {
    let token = this.tokenizer.peek();

    if (token.type == TokenType.Number) {
      this.tokenizer.consume();
      return {
        type: TokenType.Number,
        value: token.value,
      };
    }

    if (token.type == TokenType.LParen) {
      this.tokenizer.consume();
      let exp = this.parseExpression();

      let nextToken = this.tokenizer.peek();

      if (nextToken.type != TokenType.RParen) {
        throw new Error('Missing closing parenthesis');
      }

      this.tokenizer.consume();

      return exp;
    }

    throw new Error(`Invalid token at position ${this.tokenizer.pos}`);
  };
}
