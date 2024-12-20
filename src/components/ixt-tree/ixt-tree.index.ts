// ixt-tree.index.ts
export * from './ixt-tree.component';
export * from './ixt-tree.module';

export interface TreeNode {
  id: string;
  label: string;
  expanded?: boolean;
  children?: TreeNode[];
  isLeaf?: boolean;
}