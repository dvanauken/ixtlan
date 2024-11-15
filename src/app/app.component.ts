// app.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TableConfig } from '../components/ixt-table/ixt-table.interfaces';
import { IxtDialogComponent, DialogType, DialogButton, DialogResult } from '../components/ixt-dialog';
import { Layer } from '../components/ixt-layer-manager/ixt-layer-manager.component';
import { TreeNode } from '../components/ixt-tree/ixt-tree.component';


@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
 @ViewChild(IxtDialogComponent) dialog!: IxtDialogComponent;

  mapLayers: Layer[] = [
    {
      id: 'layer1',
      name: 'Base Map',
      visible: true,
      fillColor: '#e3e3e3',
      strokeColor: '#666666',
      strokeStyle: 'solid' as const,
      order: 0
    },
    {
      id: 'layer2',
      name: 'Roads',
      visible: true,
      fillColor: '#ffffff',
      strokeColor: '#333333',
      strokeStyle: 'solid' as const,
      order: 1
    },
    {
      id: 'layer3',
      name: 'Points of Interest',
      visible: true,
      fillColor: '#ff4444',
      strokeColor: '#cc0000',
      strokeStyle: 'dotted' as const,
      order: 2
    }
  ];

  // Add tree data
  treeData: TreeNode[] = [
    {
      id: '1',
      label: 'Project Files',
      children: [
        {
          id: '1.1',
          label: 'src',
          children: [
            {
              id: '1.1.1',
              label: 'app',
              children: [
                { id: '1.1.1.1', label: 'components' },
                { id: '1.1.1.2', label: 'services' }
              ]
            },
            { id: '1.1.2', label: 'assets' }
          ]
        },
        {
          id: '1.2',
          label: 'config',
          children: [
            { id: '1.2.1', label: 'tsconfig.json' },
            { id: '1.2.2', label: 'package.json' }
          ]
        }
      ]
    }
  ];

  // Add tree event handlers
  onNodeExpanded(node: TreeNode): void {
    console.log('Node expanded:', node);
  }

  onNodeCollapsed(node: TreeNode): void {
    console.log('Node collapsed:', node);
  }

  onNodeSelected(node: TreeNode): void {
    console.log('Node selected:', node);
  }



 ngAfterViewInit() {
   if (this.dialog) {
     this.dialog.visible = false;
   }
 }

 employeeData = [
   { empId: 'E001', name: 'John Smith', department: 'IT', projects: 3, rating: 4.5 },
   { empId: 'E002', name: 'Sarah Johnson', department: 'HR', projects: 2, rating: 4.8 },
   { empId: 'E003', name: 'Mike Williams', department: 'IT', projects: 4, rating: 4.2 },
   { empId: 'E004', name: 'Lisa Brown', department: 'Marketing', projects: 3, rating: 4.6 }
 ];

 employeeConfig: TableConfig<any> = {
   columns: [
     { key: 'empId', header: 'Employee ID', sortable: true },
     { key: 'name', header: 'Name', sortable: true, filterable: true },
     { key: 'department', header: 'Department', filterable: true },
     { key: 'projects', header: 'Projects', sortable: true },
     { key: 'rating', header: 'Rating', sortable: true }
   ],
   selectionMode: 'single',
   allowEdit: true
 };

 salesData = [
   { id: 1, product: 'Laptop', quantity: 50, revenue: 75000, date: '2024-02-01' },
   { id: 2, product: 'Mouse', quantity: 150, revenue: 4500, date: '2024-02-01' },
   { id: 3, product: 'Keyboard', quantity: 100, revenue: 8000, date: '2024-02-02' }
 ];

 salesConfig: TableConfig<any> = {
   columns: [
     { key: 'id', header: 'ID', sortable: true },
     { key: 'product', header: 'Product', sortable: true, filterable: true },
     { key: 'quantity', header: 'Quantity', sortable: true },
     { key: 'revenue', header: 'Revenue', sortable: true,
       formatter: (val) => `$${val.toLocaleString()}` },
     { key: 'date', header: 'Date', sortable: true }
   ],
   selectionMode: 'multiple',
   allowEdit: false
 };

 inventoryData = [
   { sku: 'INV001', item: 'Widget A', stock: 150, status: 'In Stock', lastUpdated: '2024-02-15' },
   { sku: 'INV002', item: 'Widget B', stock: 75, status: 'Low Stock', lastUpdated: '2024-02-14' },
   { sku: 'INV003', item: 'Widget C', stock: 0, status: 'Out of Stock', lastUpdated: '2024-02-13' }
 ];

 inventoryConfig: TableConfig<any> = {
   columns: [
     { key: 'sku', header: 'SKU', sortable: true },
     { key: 'item', header: 'Item', sortable: true, filterable: true },
     { key: 'stock', header: 'Stock', sortable: true },
     { key: 'status', header: 'Status', filterable: true },
     { key: 'lastUpdated', header: 'Last Updated', sortable: true }
   ],
   selectionMode: 'none',
   allowEdit: true,
   allowDelete: true
 };

 async onSave(event: MouseEvent) {
   event.preventDefault();
   event.stopPropagation();

   if (!this.dialog) return;

   this.dialog.config = {
     title: 'Save Employee',
     message: 'Are you sure you want to save this employee record?',
     type: DialogType.QUESTION,
     buttons: DialogButton.YES | DialogButton.NO,
     isModal: true
   };
   this.dialog.visible = true;

   try {
     const result = await new Promise<DialogResult>(resolve => {
       const sub = this.dialog.close.subscribe(dialogResult => {
         this.dialog.visible = false;
         resolve(dialogResult);
         sub.unsubscribe();
       });
     });

     if (result.button === DialogButton.YES) {
       console.log('Saving employee...');
     }
   } catch (error) {
     console.error('Dialog error:', error);
   }
 }

   onLayerChange(layers: any[]) {
     console.log('Layers updated:', layers);
     // Implement your layer update logic here
   }

   onLayerOrderChange(layers: any[]) {
     console.log('Layer order changed:', layers);
     // Implement your layer order update logic here
   }


}
