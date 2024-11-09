import { Component } from '@angular/core';
import { TableConfig } from './components/ixt-table/ixt-table.interfaces';

interface ExampleData {
  id: number;
  name: string;
  value: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: ExampleData[] = [
    { id: 1, name: 'Example 1', value: 100 },
    { id: 2, name: 'Example 2', value: 200 }
  ];

  config: TableConfig<ExampleData> = {
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name', editable: true },
      { key: 'value', header: 'Value', editable: true }
    ],
    selectionMode: 'multiple',
    allowAdd: true,
    allowEdit: true,
    allowDelete: true
  };
}