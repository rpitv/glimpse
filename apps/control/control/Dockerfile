FROM node:16
CMD [ "npm", "start" ]

WORKDIR /usr/src/app

RUN apt update
RUN apt install -y ffmpeg

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

COPY ./src ./src
COPY ./tsconfig.json .

RUN npm run build
