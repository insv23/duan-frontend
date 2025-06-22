# Duan - URL Shortener Frontend

Duan is a simple and modern web application for managing and shortening URLs. It provides a clean interface to create, view, search, and manage your short links.

## Prerequisites

Before setting up this frontend application, you need to deploy the backend API first:

**Backend Repository**: [https://github.com/insv23/duan](https://github.com/insv23/duan)

Please follow the deployment instructions in the backend repository to get your API up and running.

## Features

- **Cloudflare Pages Deployment**: Deploy to Cloudflare Pages for free hosting with global CDN - no server management required
- **Create Short Links**: Quickly generate short links with a custom slug, a destination URL, and an optional description.
- **Link List**: View all your created links in a clean, card-based layout.
- **Search**: Instantly filter links by slug, destination URL, or description.
- **Edit Links**: Modify the destination URL, description, or status of any link.
- **Enable/Disable Links**: Easily activate or deactivate links.
- **Copy to Clipboard**: Copy the full short URL with a single click.
- **Visit Count**: Track how many times your links have been visited.
- **Responsive Design**: A seamless experience on both desktop and mobile devices.
- **Dark Mode**: Because why not?

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context API
- **Schema Validation**: [Zod](https://zod.dev/) (via `@t3-oss/env-nextjs`)
- **Date Formatting**: [date-fns](https://date-fns.org/)

## Development Setup

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [npm](https://www.npmjs.com/) (or your package manager of choice)
- **Backend API deployed and running** (see Prerequisites section above)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/duan-frontend.git
    cd duan-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    For development, copy this file to `.env.development`:

    ```bash
    cp .env.example .env.development
    ```

    Now, open `.env.development` and fill in the appropriate values for your local setup. Make sure to point `BACKEND_API_URL` to your deployed backend API.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deployment

### Environment Variables

For production deployment, copy the example file to `.env.production`:

```bash
cp .env.example .env.production
```

Now, open `.env.production` and fill in the appropriate values for your local setup. Make sure to point `BACKEND_API_URL` to your deployed backend API.

The easiest way to deploy your Next.js app is to use [Cloudflare Pages](https://pages.cloudflare.com/). You can deploy by running:

```bash
npm run deploy
```



