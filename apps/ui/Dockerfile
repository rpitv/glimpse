FROM node:20
CMD [ "npm", "run", "preview" ]
EXPOSE 4000
USER node

# Build-time CWD is the root of the monorepo. Reference this file using "-f apps/ui/Dockerfile".
WORKDIR /usr/src/app/
COPY --chown=node:node ./package*.json .

WORKDIR /usr/src/app/apps/ui
COPY --chown=node:node apps/ui/package.json .
RUN --mount=type=secret,id=npmrc,dst=/home/node/.npmrc,uid=1000 npm ci

COPY --chown=node:node apps/ui .
RUN npm run generate
RUN npm run build

FROM nginx:1.23.1-alpine
EXPOSE 80

COPY apps/ui/nginx.conf /etc/nginx/nginx.conf

COPY --from=0 /usr/src/app/apps/ui/dist /usr/share/nginx/html
