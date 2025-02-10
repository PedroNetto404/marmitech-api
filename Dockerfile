FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production --silent

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
 