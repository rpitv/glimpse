FROM node:22 AS build
USER node

WORKDIR /usr/src/app/
COPY --chown=node:node ./package*.json .

WORKDIR /usr/src/app/apps/discord
COPY --chown=node:node apps/discord/package.json .
RUN npm install

COPY --chown=node:node apps/discord/src ./src
COPY --chown=node:node apps/discord/tsconfig.json .
RUN npm run types


FROM node:22 AS production
USER node
CMD [ "npm", "run", "start" ]

WORKDIR /usr/src/app/
COPY --from=build --chown=node:node ./package*.json .

WORKDIR /usr/src/app/apps/discord
COPY --chown=node:node apps/discord/package.json .
RUN npm install --omit=dev

COPY --chown=node:node apps/discord/src ./src

