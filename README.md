# Zombie Survival Social Network

The object of this project is to provide a Backend application to deal with survivors of a zombie apocalypse that will be used in a social network.

## Install

First of all, you need install _NodeJS_ version 8.9.3 (LTS). For more information about the installation, 
you may see in [NodeJS](https://nodejs.org/en/) Website.

About database, we use _MongoDB_ that must be installed. For more information about the installation, see
 [MongoDB](https://www.mongodb.com/) Website.

To install the application, just unzip the received zip file or clone from GitHub:

```
git clone https://github.com/AlexRobertoCorrea/zombie-survival-social-network.git
```

Next, enter in the folder zombie-survival-social-network:

```
cd zombie-survival-social-network
```

So, install the packages needed:

```
npm install
```

## Usage

In the Zombie Survival Social Network application, we deal with it using APIs, for example, we can _Post_ a survivor, update his/her location,
notify if he/she is infected, trade supplies between survivors and get their reports. We use [Apiary](https://apiary.io/) as tool to describe 
each API in detail and we can check it out in this [link](https://zombiesurvivorsocialnetwork.docs.apiary.io/#);

So, to run the application, enter the folder:

```
cd zombie-survival-social-network
```

and run:

```
npm start
```

and the application will be available in the port _3002_. In other words, the prefix of APIs is _http://localhost:3002_.

If you want to run the automated tests, run:

```
npm test
```

## Technical decisions

By familiarity, we decided to use _NodeJS_ as middleware, _Express_ as Backend Framework and _JavaScript_ with _EcmaScript 6_ as the language. 
Modelling data was easy thinking in objects, so, we decided to use _MongoDB_ as our database. _Mocha_ and _Chai_ were used as Tests Framework and 
we set at least 90% of coverage. Nowadays, we have about 98% of lines coverage, which is awesome! Therefore, _Eslint_ was used to check our 
code pattern and it works well when we run the tests.