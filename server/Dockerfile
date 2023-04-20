FROM node:18-alpine

# Create directory to hold the application code inside the image
WORKDIR /usr/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# Fix for module resolver throwing errors while trying to resolve .bin in node_modules
RUN echo "export PATH=/usr/app/node_modules/.bin:${PATH}" >> /root/.profile

# Build
COPY tsconfig.json ./
COPY src ./src
COPY .env.local ./.env
RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "start"]
