FROM node:22-alpine

WORKDIR /.

COPY package.json .

RUN npm install

COPY . . 

EXPOSE 6000

CMD ["npm", "start"]