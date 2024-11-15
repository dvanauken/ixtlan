// ixt-tree.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TreeNode {
  id: string;
  label: string;
  expanded?: boolean;
  children?: TreeNode[];
  isLeaf?: boolean;
}

@Component({
  selector: 'ixt-tree',
  templateUrl: './ixt-tree.component.html',
  styleUrls: ['./ixt-tree.component.scss']
})
export class IxtTreeComponent {
  @Input() nodes: TreeNode[] = [];
  @Output() nodeExpanded = new EventEmitter<TreeNode>();
  @Output() nodeCollapsed = new EventEmitter<TreeNode>();
  @Output() nodeSelected = new EventEmitter<TreeNode>();

  toggleNode(node: TreeNode, event: Event): void {
    event.stopPropagation();

    if (node.children && node.children.length > 0) {
      node.expanded = !node.expanded;
      if (node.expanded) {
        this.nodeExpanded.emit(node);
      } else {
        this.nodeCollapsed.emit(node);
      }
    }
  }

  selectNode(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.nodeSelected.emit(node);
  }

  trackByFn(index: number, item: TreeNode): string {
    return item.id;
  }
}

