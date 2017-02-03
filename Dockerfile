FROM ubuntu:17.04

RUN apt-get -qq update
RUN apt-get -y install curl build-essential apt-utils libssl-dev
RUN apt-get -y install git default-jre firefox
RUN apt-get -y install firefox
RUN apt-get -y install cimg-dev
RUN apt-get -y install xvfb
RUN apt-get -y install libmagickcore-dev
RUN apt-get -y install python

# Node
RUN cd ~
RUN curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
RUN bash install_nvm.sh
RUN source ~/.profile
RUN nvm install 7.5
RUN nvm alias default 7.5

# Selenium + geckodriver
RUN curl -O http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar
RUN curl -L https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-linux64.tar.gz | tar xz

# App
RUN git clone https://github.com/aaronshaf/browser-phash-service.git
RUN cd browser-phash-service



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
