
# ixtlan Angular Library

**ixtlan** is a standalone Angular library of reusable web components, starting with a single component: `ixt-table`. This library is designed to be modular, decoupled, and easily integrated into any Angular project.

## Usage

Import the `ixtlan` module and use the `ixt-table` component in your Angular application.

### Example: `app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IxtTableComponent } from 'ixtlan';

@NgModule({
  declarations: [],
  imports: [BrowserModule, IxtTableComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Example: `app.component.html`

```html
<ixt-table></ixt-table>
```

## Development Workflow

While developing, use the `AppComponent` in the **ixtlan** library project to test your components visually.

### Run the Angular Application Locally

```bash
ng serve
```

Navigate to `http://localhost:4200` in your browser to see the library components in action.

## Building the Library

To build the library for publishing, use **ng-packagr**:

```bash
npx ng-packagr -p ng-package.json
```

The compiled package will be available in the `dist/ixtlan` folder.

## Publishing the Library

Publish the library to npm:

```bash
cd dist/ixtlan
npm publish
```

If you want to publish a pre-release version without changing the version number, use:

```bash
npm publish --tag next
```

## Versioning

Use **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`. Increment the version in `package.json` for major, minor, or patch changes.

## Handling Updates in Client Projects

By default, the client project will install the `latest` version. If you publish updates under the `next` tag, the client can choose to install the `next` version for rapid updates:

```bash
npm install ixtlan@next
```

To update the library in the client project:

```bash
npm update ixtlan
```

## Decoupling

**ixtlan** is designed to be completely decoupled from any specific client projects:

- The client project (e.g., `dashboard`) installs the library via npm.
- The library knows nothing about the client, ensuring true modularity and reusability.
- **npm** acts as the broker between `ixtlan` and any client projects.

## Contributing

Feel free to contribute by adding new components, services, or utilities. Make sure to:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
