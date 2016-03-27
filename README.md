# Choosely
A simple web application to help groups identify preferences through round-robin polling.

(All commands in this readme are for the command line).

## Contents
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Dev Watch](#dev-watch)

## Tech Stack
Choosely requires Node.js ≥ v5.9.0

NPM v3.7.3

SASS v3.4.15

## Installation
  – Clone this repo: `git clone git@github.com:ajfarkas/choosely.git`
  - Make sure SASS is installed: `sass -v`
    - installation: `sudo gem install sass`
  - Make sure Node is up-to-date: `node -v`
    - installation: use [NVM](https://github.com/creationix/nvm) or download [latest stable version](https://nodejs.org/en/)
  - Make sure NPM is up to date
    - installation: (`sudo npm install npm -g`)
  - Install dependencies: `npm install`

## Dev Watch
Client-side Javascript is written in es2016, and compiled using Webpack: 
  - `webpack --watch`

CSS is written using SASS, and compiled with the command 
  - `sass --watch ./sass:.`