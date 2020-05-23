FROM node:14
CMD [ "npm", "start" ]
EXPOSE 80

WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .
