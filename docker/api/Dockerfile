FROM node:16
CMD [ "npm", "start" ]
EXPOSE 4000

WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .
