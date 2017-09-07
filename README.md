# Choosely
A simple web application to help groups identify preferences through round-robin polling.

(All `$` commands in this readme are for the command line).

## Contents

  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Dev Watch](#dev-watch)
  - [Run Locally](#run-locally)

## Tech Stack
Choosely requires Node.js ≥ v6.10.2

NPM v3.7.3

SASS v3.4.15

## Installation
  - Clone this repo: `$ git clone git@github.com:ajfarkas/choosely.git`
  - Make sure SASS is installed: `$ sass -v`
    - installation: `$ sudo gem install sass`
  - Make sure Node is up-to-date: `$ node -v`
    - installation: use [NVM](https://github.com/creationix/nvm) or download [latest stable version](https://nodejs.org/en/)
  - Make sure NPM is up to date
    - installation: (`$ sudo npm install -g npm`)
  - If you don't have XCode installed on your machine, you can download the command line tools:
    - installation: `$ xcode-select --install`
  - Install dependencies: `$ npm install`
  - Build the application: `$ npm build`
  
There is one file missing, which contains the configuration details for emailing confirmations. This file is necessary to run the application, but must be added manually, with your own email details (you can't have mine):

**`node/config/smtp.js`**
````
module.exports = {
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'nlkaldfpkonlkjbdfnbksjb'
  }
}
````

## Dev Watch
Client-side Javascript is written in es2016, and compiled using Webpack: 

  - `$ webpack --watch`

CSS is written using SASS, and compiled with the following command (make sure you're in the `choosely` repo folder)

  - `$ sass --watch ./sass:./public`

## Run Locally
In order to run this application on your local machine, you need the Node server running. You can do that from the main repo folder (`choosely/`), in a different Terminal window: 

  - `$ node app`

Then you can load the page in any browser by navigating to `http://localhost:8008`.

Note: you can quit the sever in Terminal by typing `ctrl-c`.
