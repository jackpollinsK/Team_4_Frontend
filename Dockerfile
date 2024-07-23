FROM node:18

WORKDIR /home/node/app

COPY package*.json ./

ARG API_URL

ENV API_URL = "https://ivpztrmt3p.eu-west-1.awsapprunner.com/swagger#/Test%20API/testConnection"

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

