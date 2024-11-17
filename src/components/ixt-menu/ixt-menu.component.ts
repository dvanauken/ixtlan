// ixt-menu.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MenuNode } from './ixt-menu.model';

@Component({
  selector: 'ixt-menu',
  templateUrl: './ixt-menu.component.html',
  styleUrls: ['./ixt-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IxtMenuComponent {
  @Input() menuData: MenuNode[] = [];
  
  private _activeNodes: Set<MenuNode> = new Set();
  
  constructor() {}

  hasChildren(node: MenuNode): boolean {
    return !!node.children && node.children.length > 0;
  }

  isActive(node: MenuNode): boolean {
    return this._activeNodes.has(node);
  }

  toggleSubmenu(node: MenuNode, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Close other menus at the same level
    const parent = this.findParent(node);
    if (parent) {
      parent.children?.forEach(child => {
        if (child !== node) {
          this._activeNodes.delete(child);
        }
      });
    } else {
      // For top-level items
      this.menuData.forEach(item => {
        if (item !== node) {
          this._activeNodes.delete(item);
        }
      });
    }

    // Toggle the clicked menu
    if (this.isActive(node)) {
      this._activeNodes.delete(node);
      // Also close all child menus
      this.closeChildMenus(node);
    } else {
      this._activeNodes.add(node);
    }
  }

  private findParent(node: MenuNode, currentNode: MenuNode = this.menuData[0]): MenuNode | null {
    if (!currentNode.children) return null;
    
    for (const child of currentNode.children) {
      if (child === node) return currentNode;
      const found = this.findParent(node, child);
      if (found) return found;
    }
    
    return null;
  }

  private closeChildMenus(node: MenuNode): void {
    if (node.children) {
      node.children.forEach(child => {
        this._activeNodes.delete(child);
        this.closeChildMenus(child);
      });
    }
  }
}