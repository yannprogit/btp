FROM node:22-alpine

WORKDIR /.

COPY package.json .

RUN npm install

COPY . . 

EXPOSE 5050

CMD ["npm", "start"]