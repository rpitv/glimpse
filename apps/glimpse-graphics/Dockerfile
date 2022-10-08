FROM node:18

CMD ["npm", "start"]
WORKDIR /usr/src/app
EXPOSE 80

RUN git clone --branch master https://github.com/nodecg/nodecg.git .
RUN npm install --production

RUN apt-get update
RUN apt-get install -y chromium

COPY . ./bundles/glimpse-graphics
RUN cd bundles/glimpse-graphics && npm ci
RUN cd bundles/glimpse-graphics && npm run build


