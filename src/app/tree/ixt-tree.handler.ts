// src/app/tree/ixt-tree.handler.ts
import { Injectable } from '@angular/core';
import { TreeNode } from '../../components/ixt-tree/ixt-tree.component';

@Injectable({
    providedIn: 'root'
})
export class IxtTreeHandler {
    onNodeExpanded(node: TreeNode): void {
        console.log('Node expanded:', node);
    }

    onNodeCollapsed(node: TreeNode): void {
        console.log('Node collapsed:', node);
    }

    onNodeSelected(node: TreeNode): void {
        console.log('Node selected:', node);
    }
}