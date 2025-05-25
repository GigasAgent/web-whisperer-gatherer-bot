
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d5f31206-bf3e-4ba3-8b2a-0000971d59e1

## Git Branching Strategy & Environments

This project uses a Git branching strategy to manage different environments: `dev`, `test`, and `prod`.

-   **`dev`**: Main development branch. All new features and day-to-day development happen here. Lovable should be set to this branch for active development. Connects to the **Development Supabase project**.
-   **`test`**: Staging/Testing branch. Code from `dev` is merged here for testing before going to production. Connects to the **Test Supabase project**.
-   **`prod`**: Production branch. Contains the stable, live version of the application. Code from `test` is merged here after successful testing. Connects to the **Production Supabase project**.

### Environment Configuration

Supabase connection details (URL and Anon Key) are managed per environment. Configuration files are located in `src/config/`:
-   `src/config/env.development.ts`
-   `src/config/env.test.ts`
-   `src/config/env.production.ts`

**IMPORTANT**: You MUST populate these files with the actual Supabase URL and Anon Key for each of your corresponding Supabase projects. These files are version-controlled to ensure each branch can have its distinct Supabase backend.

Vite loads the correct configuration based on the mode (`development`, `test`, `production`). See `package.json` for build and preview scripts specific to each mode (e.g., `npm run build:test`, `npm run dev`).

### Workflow

1.  **Development**:
    *   Ensure Lovable is set to the `dev` branch (using the experimental GitHub Branch Switching feature).
    *   All Lovable commits will go to the `dev` branch.
    *   Run locally using `npm run dev` (uses development Supabase).

2.  **Promoting to Test**:
    *   Create a Pull Request from `dev` to `test`.
    *   Review and merge.
    *   Deploy the `test` branch to your testing environment. Test thoroughly.
    *   Build for test using `npm run build:test`.

3.  **Promoting to Production**:
    *   Create a Pull Request from `test` to `prod`.
    *   Review and merge.
    *   Deploy the `prod` branch to your production environment.
    *   Build for production using `npm run build:prod` (or `npm run build`).

### Switching Branches in Lovable

Use Lovable's experimental GitHub Branch Switching feature to change the active branch Lovable is working on. For active development, ensure it's set to `dev`.

### Supabase CLI and `supabase/config.toml`

The `supabase/config.toml` file is primarily for the Supabase CLI and local development workflows (like `supabase start`, `supabase db diff`). The client-side application (browser) uses the configurations from `src/config/env.*.ts` files. If you need to work with different Supabase projects using the CLI for each environment/branch, you'll need to manage different `supabase/config.toml` contents manually or through scripting outside of this application's client-side code. For instance, you might have `supabase/config.dev.toml`, `supabase/config.test.toml`, etc., and copy the relevant one to `supabase/config.toml` before running CLI commands for a specific environment.

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
