import { Component, Input, OnInit } from '@angular/core';

interface MatrixNode {
  [key: string]: any;
  children?: MatrixNode[];
}

@Component({
  selector: 'ixt-matrix',
  templateUrl: './ixt-matrix.component.html',
  styleUrls: ['./ixt-matrix.component.scss']
})
export class IxtMatrixComponent implements OnInit {
  @Input() data: MatrixNode[] = [];
  
  columns: string[] = [];
  isTree: boolean = false;
  expandedNodes: Set<number> = new Set();

  ngOnInit() {
    this.columns = this.getColumns(this.data);
    this.isTree = this.isTreeData(this.data);
  }

  private hasChildren(node: MatrixNode): boolean {
    return node?.children?.length > 0;
  }

  private isTreeData(data: MatrixNode[]): boolean {
    return Array.isArray(data) && data.some(item => this.hasChildren(item));
  }

  private getColumns(data: MatrixNode[]): string[] {
    if (!data?.length) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => key !== 'children');
  }

  toggleNode(index: number): void {
    if (this.expandedNodes.has(index)) {
      this.expandedNodes.delete(index);
    } else {
      this.expandedNodes.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedNodes.has(index);
  }
}