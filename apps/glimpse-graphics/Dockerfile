#
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# ! WARNING DOCKER IS CURRENTLY NOT SUPPORTED !
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#
# Score Sync from Daktronics will not work
# inside Docker.
#
# If you wish to continue go to "package.json"
# and inside the "scripts" change:
#		"watch:browser": "vite",
# to:
#		"watch:browser": "vite --host=0.0.0.0",
# then you can run this inside Docker.
#
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# ! WARNING DOCKER IS CURRENTLY NOT SUPPORTED !
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#
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


