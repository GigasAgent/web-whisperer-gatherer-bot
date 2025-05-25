
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d5f31206-bf3e-4ba3-8b2a-0000971d59e1

## Git Branching Strategy & Environments (Two-Branch Strategy)

This project uses a simplified two-branch Git strategy to manage different stages of development, using a **single Supabase project**: `main` and `test`.

-   **`main`**: Main development and production-ready branch. All new features are developed here or in feature branches merged into `main`. Lovable should typically be set to this branch for active development. This branch connects to your Supabase project. Builds from this branch are considered for production.
-   **`test`**: Staging/Testing branch. Code from `main` is merged here for testing before confirming stability. This branch also connects to the **same Supabase project** as `main`.

### Environment Configuration

Supabase connection details (URL and Anon Key) are managed using environment-specific files in `src/config/`. Since we are using a single Supabase project, these files will initially contain the same credentials but are loaded based on Vite's mode:
-   `src/config/env.development.ts`: Used by the `main` branch (when running `npm run dev` or `npm run build`).
-   `src/config/env.test.ts`: Used by the `test` branch (when running Vite in `test` mode, e.g., `npm run build:test`).

**IMPORTANT**: You MUST populate `src/config/env.development.ts` and `src/config/env.test.ts` with the actual Supabase URL and Anon Key for your Supabase project.

Vite loads the correct configuration based on the mode (`development`, `test`, `production`). The `production` mode (default for `npm run build`) will use the `development` configuration (from `env.development.ts`), suitable for the `main` branch's production builds.

### `package.json` Script Updates

You'll need to update your `package.json` scripts section to support this two-branch strategy. Replace your existing `scripts` with the following:

```json
"scripts": {
  "dev": "vite", // Runs in 'development' mode, uses env.development.ts
  "build": "vite build", // Runs in 'production' mode, uses env.development.ts via environments.ts logic
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview", // Runs in 'production' mode, previews the build
  "build:test": "vite build --mode test", // Runs in 'test' mode, uses env.test.ts
  "preview:test": "vite preview --mode test" // Runs in 'test' mode, previews the test build
},
```
**Action Required**: Manually update your `package.json` with these scripts.

### Workflow

1.  **Branch Setup (One-time manual setup)**:
    *   Ensure you have a `main` branch and a `test` branch in your GitHub repository.
    *   If you have `dev` or `prod` branches from a previous setup, you might want to delete them or rename `dev` to `main`.
    *   Your `main` branch should contain the latest stable code. Create `test` from `main`.

2.  **Development on `main`**:
    *   Ensure Lovable is set to the `main` branch (using the experimental GitHub Branch Switching feature).
    *   All Lovable commits will go to the `main` branch.
    *   Run locally using `npm run dev` (uses `development` Supabase config).

3.  **Promoting to Test**:
    *   Create a Pull Request from `main` to `test`.
    *   Review and merge.
    *   Deploy the `test` branch to your testing environment (if any). Test thoroughly.
    *   Build for test using `npm run build:test`.

4.  **"Promoting" to Production (from `main`)**:
    *   Since `main` is also your production-ready branch, once changes on `main` are stable (optionally after testing via the `test` branch workflow), you can deploy the `main` branch.
    *   Build for production using `npm run build` (or your CI/CD process for `main`).

### Switching Branches in Lovable

Use Lovable's experimental GitHub Branch Switching feature to change the active branch Lovable is working on. For active development, ensure it's set to `main`.

### Supabase CLI and `supabase/config.toml`

The `supabase/config.toml` file is primarily for the Supabase CLI and local development workflows. The client-side application uses the configurations from `src/config/env.*.ts` files. Since you are using one Supabase project, your `supabase/config.toml` will point to this single project.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d5f31206-bf3e-4ba3-8b2a-0000971d59e1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d5f31206-bf3e-4ba3-8b2a-0000971d59e1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
