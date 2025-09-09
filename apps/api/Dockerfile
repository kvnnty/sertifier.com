# ---- Build Stage ----
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Install all dependencies including devDependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the project
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --prod

# ---- Production Stage ----
FROM node:lts-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy only production artifacts
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=8082

EXPOSE 8082

CMD ["node", "dist/main.js"]
