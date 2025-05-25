# GiniDocs

GiniDocs is the ultimate solution for generating and managing business documents effortlessly.

## How to Run - Development

To set up the development environment on Ubuntu 24.04 with Node.js 22 and Docker installed, follow these steps:

1. Install dependencies for the `/web` directory:
   ```bash
   cd web
   npm ci
   cd ..
   ```
2. Install dependencies for the `/backend` directory:
   ```bash
   cd backend
   npm ci
   cd ..
   ```
3. Set up environment variables:
   ```bash
   # Run this from the root folder
   cp .env.example .env
   ```
4. Run migrations:
   ```bash
   # Run this from the root folder
   npm run migration:run
   ```
5. Start the services:
   ```bash
   # Run this from the root folder
   npm run dev
   ```

It is helpful to have the NestJS CLI installed. You can install it globally with:
```bash
npm i -g @nestjs/cli
```
