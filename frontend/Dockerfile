FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ladle build
EXPOSE 5173
EXPOSE 61000
CMD ["sh", "-c", "npm run dev & npx ladle serve --host 0.0.0.0"]