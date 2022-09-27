# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# clean install
RUN npm ci

# copy source code
COPY . .
# setup production build of the app (node modules)
RUN npm build

ENV PORT=7000
EXPOSE 7000
# start app
CMD ["npm", "start"]
