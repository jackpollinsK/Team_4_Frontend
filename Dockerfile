FROM node:18

WORKDIR /home/node/app

COPY package*.json ./

ARG API_URL

ENV API_URL ${API_URL}

RUN npm install

COPY . .

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

EXPOSE 3000

CMD [ "npm", "start" ]

