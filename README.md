# Taylor Made Technology Network (TMTN)

A professional portfolio and landing page showcasing
IT infrastructure and software automation projects,
featuring dynamic GitHub repository integration.

## Tech Stack

- **Framework:** Next.js 15.5 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript

## Architecture & Deployment

- **Data Fetching:** - Utilizes Next.js server-side data fetching.
  - Implements a 3600-second revalidation cache.
  - Optimizes load times and prevents API rate limiting.

- **Build Rules:** - `next.config.js` bypasses ESLint errors during builds.
  - Prevents minor linting infractions from blocking deployments.

- **CI/CD Pipeline:** - Automated deployment handled via AWS Amplify.
  - Build specifications and caching strategies defined 
    in [`amplify.yml`](./amplify.yml).
  - Enforces a Node.js 22 runtime environment.