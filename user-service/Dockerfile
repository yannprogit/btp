FROM node:22-alpine

WORKDIR /.

COPY package.json .

RUN npm install

COPY . . 

EXPOSE 5555

CMD ["npm", "start"]