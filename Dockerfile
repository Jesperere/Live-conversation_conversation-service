FROM node:16

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ENV PORT=8999
EXPOSE 8999

CMD ["npm", "start"]