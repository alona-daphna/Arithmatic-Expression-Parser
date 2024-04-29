import { useState } from 'react';
import { Tokens } from './components/Tokens';
import { ParseTree } from './components/ParseTree';
import { ASTNode } from './types/parser';
import { Tokenizer } from './utils/tokenizer';
import { Token, TokenType } from './types/tokenizer';
import Result from './components/Result';
import { Parser } from './utils/parser';
import evaluate from './utils/eval';

function App() {
  const [error, setError] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [parseTree, setParseTree] = useState<ASTNode | null>(null);
  const [exp, setExp] = useState('');

  const calc = () => {
    try {
      setError('');
      setResult(evaluate(exp));

      const tokenizer = new Tokenizer(exp);
      const tokens = [];

      while (tokenizer.peek().type !== TokenType.EOF) {
        tokens.push(tokenizer.consume());
      }

      setTokens(tokens);

      const parser = new Parser(new Tokenizer(exp));
      setParseTree(parser.parse());
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-4/5 md:w-3/5 xl:w-1/3 m-auto">
      <h1 className="text-center mb-3 text-xl md:text-2xl font-medium">
        Arithmatic Expression Parser
      </h1>
      <div className="grid grid-cols-4">
        <input
          className="bg-teal-50 py-2 px-3 col-span-3 rounded-sm"
          onChange={(e) => setExp(e.target.value)}
          type="text"
          placeholder="10 + 2^3 * (1 + 3)"
        />
        <button
          className="bg-teal-500 hover:bg-teal-400 py-2 rounded-sm text-white"
          onClick={calc}
        >
          calc
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <>
          <Tokens tokens={tokens} />
          <ParseTree tree={parseTree!} />
          <Result result={result} />
        </>
      )}
    </div>
  );
}

export default App;
