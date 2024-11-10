# Ixtlan Angular Component Library

This library contains reusable Angular components, starting with a configurable data table component.

## Development Setup

### Building the Library

From the ixtlan project root:
```bash
ng build
```

The build output will be in `dist/ixtlan/`.

### Development with GeoView

To develop the library while testing it in GeoView:

1. Build the library first:
```bash
cd /path/to/ixtlan
ng build
```

2. Link the built library:
```bash
cd dist/ixtlan
npm link
```

3. Link from GeoView:
```bash
cd /path/to/geoview
npm link ixtlan
```

Now you can import components from the library:
```typescript
import { IxtTableModule } from 'ixtlan';

@NgModule({
  imports: [
    IxtTableModule,
    // ...
  ]
})
export class AppModule { }
```

### Making Changes

When you make changes to the library:

1. Rebuild the library:
```bash
cd /path/to/ixtlan
ng build
```

2. Changes will be automatically available to GeoView through the npm link.

### Unlinking

To remove the development links:

1. In GeoView:
```bash
npm unlink ixtlan
```

2. In Ixtlan:
```bash
cd dist/ixtlan
npm unlink
```

## Using the Library

### IxtTable Component

Import the module:
```typescript
import { IxtTableModule } from 'ixtlan';
```

Basic usage in template:
```html
<ixt-table 
  [data]="yourData"
  [columns]="yourColumns">
</ixt-table>
```

Configure columns:
```typescript
import { IxtTableColumn } from 'ixtlan';

columns: IxtTableColumn[] = [
  { field: 'name', header: 'Name' },
  { field: 'age', header: 'Age' }
];
```

### Project Structure

```
ixtlan/
├── src/
│   ├── components/
│   │   └── ixt-table/
│   │       ├── ixt-table.component.ts
│   │       ├── ixt-table.component.html
│   │       ├── ixt-table.component.scss
│   │       ├── ixt-table.interfaces.ts
│   │       ├── ixt-table.module.ts
│   │       └── ixt-table.index.ts
│   └── public-api.ts
├── package.json
└── ng-package.json
```
