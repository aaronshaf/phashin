FROM node:7.4

RUN apt-get -qq update
RUN apt-get -y install curl build-essential apt-utils libssl-dev
RUN apt-get -y install git default-jre
RUN apt-get -y install cimg-dev
RUN apt-get -y install xvfb
RUN apt-get -y install libmagickcore-dev
RUN apt-get -y install python

# Firefox
RUN apt-get -y install iceweasel

# Selenium + geckodriver
RUN curl -O http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar
RUN curl -L https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-linux64.tar.gz | tar xz

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
