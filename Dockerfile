FROM node:18.20.3-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5100
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
