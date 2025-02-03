# Runai Technologies - Career Assistant

A sophisticated AI-powered career management platform built as a hobby project. This application streamlines the job application process by providing intelligent tools for managing applications, optimizing resumes, and leveraging AI for better career outcomes.

## 🎯 Project Overview

The Career Assistant app is designed to help job seekers organize their job search process while utilizing advanced AI capabilities. It serves as a comprehensive tool for tracking applications, managing multiple resumes, and getting AI-powered insights for job search optimization.

### Key Skills Demonstrated:

- **Full-Stack Development**: Next.js 14, React 18, TypeScript
- **Modern Frontend Architecture**: 
  - Component-driven development with shadcn/ui
  - Responsive design with Tailwind CSS
  - Server-side and client-side rendering optimization
- **Backend & Infrastructure**: 
  - Edge computing with Cloudflare Pages
  - SQLite database management using D1
  - RESTful API design
- **AI Integration**: 
  - Multiple AI provider integration (OpenAI, Anthropic, Groq, Mistral)
  - Prompt engineering and AI response handling
- **Security & Authentication**: 
  - Auth0 implementation
  - Secure API design
- **DevOps & Deployment**: 
  - Cloudflare Pages deployment
  - Database migrations and management
  - Environment configuration

## 🚀 Features

- **Authentication**: Secure authentication using Auth0
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **AI Integration**: Multiple AI provider support through a unified gateway
- **Database**: Cloudflare D1 (SQLite) for data persistence
- **Edge Runtime**: Optimized for performance with Next.js edge runtime
- **Application Management**: CRUD operations for job applications
- **Resume Management**: Store and manage multiple resumes
- **Settings Configuration**: Customizable application settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Auth0
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **AI Providers**: Support for multiple AI providers (OpenAI, Anthropic, Groq, Mistral)
- **Type Safety**: TypeScript

## 🏗️ Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── server/             # Server-side code
│   ├── domain/         # Business logic
│   └── infrastructure/ # External services integration
├── migrations/         # D1 database migrations
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## 🚦 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd applications-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with the necessary environment variables:
```
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='your-auth0-base-url'
AUTH0_ISSUER_BASE_URL='your-auth0-issuer-url'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Database Configuration
DATABASE_URL='your-database-url'

# AI Provider Keys
OPENAI_API_KEY='your-openai-key'
# Add other AI provider keys as needed
```

4. **Initialize the database**
```bash
wrangler d1 migrations apply --local
```

5. **Run the development server**
```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run pages:build`: Build for Cloudflare Pages
- `npm run preview`: Preview Cloudflare Pages build locally
- `npm run deploy`: Deploy to Cloudflare Pages

## 🔄 Database Migrations

To create a new migration:
```bash
wrangler d1 migrations create [migration-name]
```

To apply migrations locally:
```bash
wrangler d1 migrations apply --local
```

## 🚀 Deployment

The application is configured for deployment on Cloudflare Pages. The deployment process is handled through the following steps:

1. Build the application: `npm run pages:build`
2. Deploy to Cloudflare Pages: `npm run deploy`

## 📄 License

[Add your license information here]
