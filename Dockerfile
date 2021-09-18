FROM node:16
CMD [ "npm", "start", "--", "--hostname", "0.0.0.0" ]
EXPOSE 80

ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./.npmrc .
COPY ./.env .

RUN npm install

COPY . .
RUN rm .npmrc

RUN npm run build
