// src/app/table/ixt-table.provider.ts
import { Injectable } from '@angular/core';
import { TableConfig } from '../../components/ixt-table/ixt-table.interfaces';

@Injectable({
    providedIn: 'root'
})
export class IxtTableProvider {
    // Employee table
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

    // Sales table
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

    // Inventory table
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
}