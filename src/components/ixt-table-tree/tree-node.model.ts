export interface TreeNode {
    id: string;
    level: number;
    expanded?: boolean;
    children?: TreeNode[];
    data: Record<string, any>;
    parent?: TreeNode;
  }

  export interface TreeNodeData {
    id: string;
    children?: TreeNodeData[];
    [key: string]: any;
  }
  
  export interface TableTreeColumn {
    field: string;
    type: 'string' | 'number' | 'date' | 'progress';
    header: string;
  }
  