import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableTreeColumn, TreeNode, TreeNodeData } from './tree-node.model';



@Component({
  selector: 'ixt-table-tree',
  templateUrl: './ixt-table-tree.component.html',
  styleUrls: ['./ixt-table-tree.component.scss']
})
export class IxtTableTreeComponent implements OnInit {
  @Input() src!: string;
  @Output() nodesMoved = new EventEmitter<{nodes: TreeNode[], type: string}>();
  
  columns: TableTreeColumn[] = [];
  flatNodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  dropPosition: 'top' | 'bottom' | null = null;
  private rootNodes: TreeNode[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const data = await this.http.get<{ items: TreeNodeData[] }>(this.src).toPromise();
      if (!data) throw new Error('No data received');
      
      this.detectColumns(data);
      this.buildTreeStructure(data);
      this.flattenNodes();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  

  private detectColumns(data: any) {
    const sample = data.items[0];
    this.columns = Object.keys(sample)
      .filter(key => key !== 'children' && key !== 'id')
      .map(key => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        type: this.detectColumnType(sample[key])
      }));
  }

  private detectColumnType(value: any): 'string' | 'number' | 'date' | 'progress' {
    if (typeof value === 'number') {
      return value <= 100 && value >= 0 ? 'progress' : 'number';
    }
    if (!isNaN(Date.parse(value))) return 'date';
    return 'string';
  }

  private buildTreeStructure(data: { items: TreeNodeData[] }) {
    const processNode = (node: TreeNodeData, level: number, parent?: TreeNode): TreeNode => {
      const treeNode: TreeNode = {
        id: node.id,
        level,
        expanded: true,
        data: { ...node },
        parent
      };
  
      if (node.children) {
        treeNode.children = node.children.map(child => 
          processNode(child, level + 1, treeNode)
        );
      }
  
      return treeNode;
    };
  
    this.rootNodes = data.items.map(item => processNode(item, 0));
  }

  private flattenNodes() {
    this.flatNodes = [];
    const processNode = (node: TreeNode) => {
      this.flatNodes.push(node);
      if (node.expanded && node.children) {
        node.children.forEach(processNode);
      }
    };
    this.rootNodes.forEach(processNode);
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
  }

  toggle(node: TreeNode, event: Event) {
    event.stopPropagation();
    node.expanded = !node.expanded;
    this.flattenNodes();
  }

  hasChildren(node: TreeNode): boolean {
    return Boolean(node?.children?.length);
  }

  increaseLevel() {
    // if (!this.selectedNode) return; // Ensure a selected node exists
  
    // const index = this.flatNodes.indexOf(this.selectedNode);
    // if (index <= 0 || this.selectedNode.level === 0) return; // Ensure it's not the first node and is at a valid level
  
    // const previousSibling = this.flatNodes[index - 1];
    // if (!previousSibling || previousSibling.level !== this.selectedNode.level) return; // Ensure previous sibling exists and is at the same level
  
    // const currentParent = this.selectedNode.parent;
    // if (!currentParent || !Array.isArray(currentParent.children)) return; // Ensure parent and children array exist
  
    // // Remove the node from its current parent's children array
    // currentParent.children = currentParent.children.filter(
    //   child => child && child.id !== this.selectedNode.id
    // );
  
    // // Add the node to the previous sibling's children array
    // if (!Array.isArray(previousSibling.children)) {
    //   previousSibling.children = []; // Initialize children array if not already present
    // }
    // previousSibling.children.push(this.selectedNode);
  
    // // Update the parent and level of the selected node
    // this.selectedNode.parent = previousSibling;
    // this.selectedNode.level++;
  
    // // Rebuild the flat node structure and emit the change event
    // this.flattenNodes();
    // this.nodesMoved.emit({ nodes: [this.selectedNode], type: 'level-changed' });
  }
    
  
  decreaseLevel() {
    // if (!this.selectedNode || !this.selectedNode.parent) return;
    // const parentNode = this.selectedNode.parent;
    // const grandParent = parentNode.parent;

    // if (grandParent) {
    //   parentNode.children = parentNode.children?.filter(
    //     child => child.id !== this.selectedNode.id
    //   );

    //   const parentIndex = grandParent.children?.indexOf(parentNode) ?? -1;
    //   if (parentIndex >= 0) {
    //     grandParent.children?.splice(parentIndex + 1, 0, this.selectedNode);
    //     this.selectedNode.parent = grandParent;
    //     this.selectedNode.level--;

    //     this.flattenNodes();
    //     this.nodesMoved.emit({nodes: [this.selectedNode], type: 'level-changed'});
    //   }
    // }
  }

  moveUp() {
    if (!this.selectedNode) return;
    const index = this.flatNodes.indexOf(this.selectedNode);
    if (index > 0) {
      const prevNode = this.flatNodes[index - 1];
      if (prevNode.level === this.selectedNode.level) {
        const parent = this.selectedNode.parent;
        const siblings = parent?.children ?? this.rootNodes;
        const nodeIndex = siblings.indexOf(this.selectedNode);
        
        if (nodeIndex > 0) {
          [siblings[nodeIndex - 1], siblings[nodeIndex]] = 
          [siblings[nodeIndex], siblings[nodeIndex - 1]];
          
          this.flattenNodes();
          this.nodesMoved.emit({nodes: [this.selectedNode], type: 'reordered'});
        }
      }
    }
  }

  moveDown() {
    if (!this.selectedNode) return;
    const index = this.flatNodes.indexOf(this.selectedNode);
    if (index < this.flatNodes.length - 1) {
      const nextNode = this.flatNodes[index + 1];
      if (nextNode.level === this.selectedNode.level) {
        const parent = this.selectedNode.parent;
        const siblings = parent?.children ?? this.rootNodes;
        const nodeIndex = siblings.indexOf(this.selectedNode);
        
        if (nodeIndex < siblings.length - 1) {
          [siblings[nodeIndex], siblings[nodeIndex + 1]] = 
          [siblings[nodeIndex + 1], siblings[nodeIndex]];
          
          this.flattenNodes();
          this.nodesMoved.emit({nodes: [this.selectedNode], type: 'reordered'});
        }
      }
    }
  }

  onDrop(event: any) {
    const node = event.item.data;
    const newIndex = event.currentIndex;
    const oldIndex = event.previousIndex;
    
    if (newIndex !== oldIndex) {
      const parent = this.selectedNode?.parent;
      const siblings = parent?.children ?? this.rootNodes;
      siblings.splice(oldIndex, 1);
      siblings.splice(newIndex, 0, node);
      
      this.flattenNodes();
      this.nodesMoved.emit({nodes: [node], type: 'dragged'});
    }
  }

  canMoveUp(): boolean {
    if (!this.selectedNode) return false;
    const index = this.flatNodes.indexOf(this.selectedNode);
    return index > 0 && this.flatNodes[index - 1].level === this.selectedNode.level;
  }

  canMoveDown(): boolean {
    if (!this.selectedNode) return false;
    const index = this.flatNodes.indexOf(this.selectedNode);
    return index < this.flatNodes.length - 1 && 
           this.flatNodes[index + 1].level === this.selectedNode.level;
  }
}