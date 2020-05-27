FROM node:14
CMD [ "npm", "start" ]
EXPOSE 80

ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./.npmrc .

RUN npm install
RUN rm .npmrc

COPY . .

RUN npm run build
