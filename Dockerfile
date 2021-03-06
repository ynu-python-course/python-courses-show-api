# Set the base image to nginx
FROM node:8

# File Author / Maintainer
MAINTAINER Liudonghua <liudonghua123@gmail.com>

# update the repository sources list
RUN apt-get update

# install vim for quick modify
RUN apt-get install -y vim

# http://www.clock.co.uk/blog/a-guide-on-how-to-cache-npm-install-with-docker
ADD package.json /app/package.json

WORKDIR /app

RUN npm install

# copy static resources to the specified location
COPY src /app/src
COPY public /app/public
COPY views /app/views
COPY test /app/test
# copy frontend static files to the specified location
COPY frontend/python-courses-show/build/ /app/public

RUN ls -la /app/public/
RUN ls -la /app/

# main application command
CMD npm run start
