FROM node:8

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=dev
ENV NODE_ENV $NODE_ENV

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

#Prepare App Data Assets on build (optional)
#RUN npm run-script datasync


EXPOSE 8080
CMD [ "npm", "start" ]