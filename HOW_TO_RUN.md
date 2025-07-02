## How to Run the Project


### SERVER (NestJS Backend)

Run the NestJS backend API.

> ✅ Make sure your `server/.env` file is configured correctly based on `server/.env.example`.

```bash
cd server
pnpm install

# Setup the DB
pnpm prisma generate
pnpm prisma migrate dev --name init

# Start the development server
pnpm start:dev

```

### WEB CLIENT
Run the frontend server.
> Ensure your `web/.env` in web subdir is setup as shown in `web/.env.example`

```bash
cd web
pnpm i
pnpm dev
```


> Both apps use pnpm for dependency management