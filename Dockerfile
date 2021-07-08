FROM node:14.16.0-alpine
#FROM ubuntu as builder
# RUN apt-get update && apt-get upgrade -y
# RUN apt-get install nodejs -y
# RUN apt install npm -y
# ENV PORT 3000

# Create app directory
WORKDIR /usr/src/app

# Installing dependencies
# COPY package.json ./
# Copying source files
COPY . .

RUN yarn install

# RUN npm install -g npm@7.6.3

# # Building app
RUN yarn build
EXPOSE 3000

# # Running the app
CMD ["yarn", "start"]