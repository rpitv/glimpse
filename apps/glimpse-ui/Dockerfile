FROM node:16
CMD [ "npm", "run", "preview" ]
EXPOSE 4000

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm ci

COPY . .
RUN npm run generate
RUN npm run build

FROM nginx:1.23.1-alpine
EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
