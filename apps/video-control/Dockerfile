FROM node:20-slim AS build
USER node

# Build-time CWD is the root of the monorepo. Reference this file using "-f apps/video-control/Dockerfile".
WORKDIR /usr/src/app

# Copy monorepo package.json and package-lock.json
COPY --chown=node:node ./package*.json .

# Switch to video-control folder
WORKDIR /usr/src/app/apps/video-control

# Copy video-control package.json
COPY --chown=node:node ./apps/video-control/package.json .

# Install dependencies
RUN npm ci

# Copy source
COPY --chown=node:node ./apps/video-control/ .

# Build project
RUN npm run build

# Install production dependencies
RUN npm ci --omit=dev

FROM node:20-slim AS production
CMD [ "node", "dist/index.js" ]
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install FFMPEG
RUN apt-get update
RUN apt-get install -y ffmpeg

USER node

# Copy built app from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/apps/video-control/dist ./dist




