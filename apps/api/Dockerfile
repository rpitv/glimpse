FROM node:20-slim AS build

# Install OpenSSL for Prisma
RUN apt-get update -y
RUN apt-get install -y openssl

# Initialize environment
CMD ["npm", "run", "start:prod"]
EXPOSE 4000
USER node

# Build-time CWD is the root of the monorepo. Reference this file using "-f apps/api/Dockerfile".
WORKDIR /usr/src/app

# Copy monorepo package.json and package-lock.json files
COPY --chown=node:node ./package*.json .
COPY --chown=node:node ./LICENSE .

# Copy Prisma monorepo package. This should later be changed/removed to install the published version
COPY --chown=node:node ./packages/prisma packages/prisma

# Switch to API package
WORKDIR /usr/src/app/apps/api

# Copy API package.json
COPY --chown=node:node apps/api/package.json .

# Install dependencies
RUN npm ci

# Copy source files
COPY --chown=node:node apps/api .

# Build NestJS project
RUN npm run build

# Install production dependencies
RUN npm ci --omit=dev

FROM node:20-slim AS production

# Install OpenSSL for Prisma
RUN apt-get update -y
RUN apt-get install -y openssl

# Initialize environment
CMD ["node", "dist/main"]
EXPOSE 4000
USER node
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy built NestJS app from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/apps/api/dist ./dist


