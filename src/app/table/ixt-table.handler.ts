// src/app/table/ixt-table.handler.ts
import { Injectable } from '@angular/core';
import { TableConfig } from '../../components/ixt-table/ixt-table.interfaces';

@Injectable({
    providedIn: 'root'
})
export class IxtTableHandler {
    onSort(event: any) {
        console.log('Sort event:', event);
    }

    onFilter(event: any) {
        console.log('Filter event:', event);
    }

    onRowSelect(event: any) {
        console.log('Row select:', event);
    }

    onEdit(event: any) {
        console.log('Edit event:', event);
    }

    onDelete(event: any) {
        console.log('Delete event:', event);
    }
}