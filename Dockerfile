FROM node:16
CMD [ "npm", "start", "--", "--hostname", "0.0.0.0" ]
EXPOSE 3000

WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .

RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm install --legacy-peer-deps

COPY . .

RUN npm run build
