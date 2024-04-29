import React from 'react';
import { Token } from '../types/tokenizer';

export const Tokens = ({ tokens }: { tokens: Token[] }) => {
  return (
    <>
      <h2 className="mt-5 font-medium mb-2">1. Token breakdown</h2>
      <div className=" flex gap-2 items-center flex-wrap px-5">
        [
        {tokens.map((token, index) => {
          return (
            <div key={index} className="flex gap-1">
              (<p>'{token.value}',</p>
              <p className=" text-red-500">{token.type}</p>)
              {index < tokens.length - 1 ? ',' : ''}
            </div>
          );
        })}
        ]
      </div>
    </>
  );
};
