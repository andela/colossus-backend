FROM node:10-alpine
COPY package*.json ./
WORKDIR /
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4500
CMD ["npm", "run", "start-docker:dev"]
