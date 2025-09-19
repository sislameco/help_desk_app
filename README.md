# OMS Admin App

This project is built with **Angular 20+**, following the latest best
practices.\
Testing is integrated using **Vitest** (unit/component) and
**Playwright** (E2E), with a **TDD-first approach**.

---

## 🚀 Development Server

Start the local dev server:

```bash
ng serve
```

Open <http://localhost:4200> in your browser.\
The app reloads automatically when source files are modified.

---

## 👤 Test User Credentials

You can log in with:

- **Email:** test@example.com
- **Password:** Password@123

---

## ⚒️ Code Scaffolding

Generate features with Angular CLI schematics. For example:

```bash
ng generate component component-name
```

See all options:

```bash
ng generate --help
```

---

## 📦 Build

Run a production build:

```bash
ng build
```

Build artifacts are stored in `dist/`.\
Production builds are optimized for performance.

---

## 🧪 Testing (TDD Workflow)

### Unit & Component Tests (Vitest)

We use **Vitest** for fast unit and component testing:

```bash
ng test
```

Run tests in watch mode for TDD:

```bash
ng test --watch
```

More info: [Vitest Docs](https://vitest.dev/).

### End-to-End Tests (Playwright)

E2E tests are powered by **Playwright**:

```bash
npx playwright test
```

Launch UI test runner:

```bash
npx playwright test --ui
```

More info: [Playwright Docs](https://playwright.dev/).

---

## 🧹 Code Quality

- **Prettier** → Code formatting\
- **ESLint** → Linting & best practices\
- **Husky** → Git hooks (prevent bad commits/pushes)

👉 Install Prettier & ESLint IDE extensions for the best DX.

---

## 📚 Resources

- [Angular CLI Docs](https://angular.dev/tools/cli)\
- [Angular Style Guide](https://angular.dev/style-guide)\
- [Vitest Docs](https://vitest.dev/)\
- [Playwright Docs](https://playwright.dev/)

---

## ⚡ Angular 20+ Best Practices

- **Signals for local state** → Prefer `signal`, `computed`, `effect`
  over RxJS for component state.\
- **New Control Flow Syntax** → Use `@if`, `@for`, `@switch` (instead
  of legacy `*ngIf`, `*ngFor`, `*ngSwitch`).\
- **Standalone Components** → No `NgModules`.\
- **Inputs/Outputs** → Use `input()` & `output()` functions, not
  decorators.\
- **Host Config** → Use `host` property in components/directives
  (avoid `@HostBinding`, `@HostListener`).\
- **Change Detection** → Always use `ChangeDetectionStrategy.OnPush`.\
- **Optimized Images** → Use `NgOptimizedImage` for assets.

⚠️ Enforce these during reviews even if tooling doesn't catch
violations.

---

## 📂 Project Structure

```plaintext
public/                # Static assets (favicon, images)
src/
  app/
    core/              # Core: auth, guards, interceptors, layout, services, store
      auth/            # Auth components, services, models, resolvers
      interceptors/    # HTTP interceptors
      layout/          # Layout enums, services, resolvers
      services/        # Shared core services (cookies, storage, etc.)
      store/           # Global state (auth, errors, etc.)
    features/          # Feature modules (home, dashboard, etc.)
    shared/            # Shared helpers, pipes, utilities
    app.*              # Root config, routes, styles
  environments/        # Environment configs (dev, staging, prod)
  index.html           # Main entry HTML
  main.ts              # App bootstrap
  styles.scss          # Global styles
  test-setup.ts        # Vitest setup utilities
tests/                 # Playwright E2E tests
tests-examples/        # Example Playwright tests
test-results/          # Test run artifacts
config files           # (.editorconfig, .gitignore, eslint, prettier, tsconfig, vite, etc.)
README.md              # Project documentation
```

---

### ✅ Recommended Todo Setup

- For **VS Code** users → install **[Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)**
- For **WebStorm** users → use the built-in **TODO Tool Window**
- ✅ This project is structured for **scalability, maintainability, and
  TDD**.
