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

  public hasChildren(node: MatrixNode): boolean {
    return Array.isArray(node?.children) && node.children.length > 0;
  }


  public isTreeData(data: MatrixNode[]): boolean {
    return Array.isArray(data) && data.some(item => this.hasChildren(item));
  }

  public getColumns(data: MatrixNode[]): string[] {
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