export interface ASTNode {
  type: string;
  value: string;
  left?: ASTNode;
  right?: ASTNode;
}
