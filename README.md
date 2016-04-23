# Choosely
A simple web application to help groups identify preferences through round-robin polling.

(All `$` commands in this readme are for the command line).

## Contents

  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Dev Watch](#dev-watch)
  - [Run Locally](#run-locally)

## Tech Stack
Choosely requires Node.js ≥ v4.2.6

NPM v3.7.3

SASS v3.4.15

## Installation

  - Clone this repo: `$ git clone git@github.com:ajfarkas/choosely.git`
  - Make sure SASS is installed: `$ sass -v`
    - installation: `$ sudo gem install sass`
  - Make sure Node is up-to-date: `$ node -v`
    - installation: use [NVM](https://github.com/creationix/nvm) or download [latest stable version](https://nodejs.org/en/)
  - Make sure NPM is up to date
    - installation: (`$ sudo npm install  -g npm`)
  - Install dependencies: `$ npm install`

## Dev Watch
Client-side Javascript is written in es2016, and compiled using Webpack: 

  - `$ webpack --watch`

CSS is written using SASS, and compiled with the following command (make sure you're in the `choosely` repo folder)

  - `$ sass --watch ./sass:./public`

## Run Locally
In order to run this application on your local machine, you need both a Node and HTTP server running. A simple way to do the latter is with `http-server`.

  - `$ sudo npm install -g http-server`

Once that's done, you can run both servers from the main repo folder (`choosely/`), in two different Terminal windows: 

  - `$ node app`
  - `$ http-server -p 8008`

Then you can load the page in any browser by navigating to `http://localhost:8008`.

Note: you can quit either sever in Terminal by typing `ctrl-c`.
