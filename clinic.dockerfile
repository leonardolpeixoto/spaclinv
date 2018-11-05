FROM node:8-alpine

MAINTAINER Leonardo Peixoto
ENV NODE_ENV=development

COPY . /var/www
WORKDIR /var/www

RUN npm i

ENTRYPOINT ["npm", "start"]

