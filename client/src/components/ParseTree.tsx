import { ASTNode } from '../types/parser';

// recursive
// plot tree graph
// make interactive

export const ParseTree = ({ tree }: { tree: ASTNode }) => {
  console.log(tree);

  return (
    <div>
      <h2 className="font-medium my-3">2. Parse Tree</h2>
    </div>
  );
};
