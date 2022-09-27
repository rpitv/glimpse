FROM node:16
CMD [ "npm", "start" ]

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y ffmpeg

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

COPY ./src ./src
COPY ./tsconfig.json .

RUN npm run build
