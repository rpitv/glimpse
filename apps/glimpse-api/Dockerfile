FROM node:16
CMD [ "npm", "start" ]
EXPOSE 4000

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

COPY ./prisma .
RUN npm run generate.prisma


RUN mkdir src
COPY ./codegen.yml .
COPY ./src/schema.graphql ./src
RUN npm run generate.graphql

COPY . .
RUN npm run build
