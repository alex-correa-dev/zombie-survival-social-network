const { MongoClient } = require('mongodb');
const async = require('async');
const logger = require('winston');

const Database = {};
const self = Database;
const collections = [];

let db;

Database.connect = (uri, callback) => {
  logger.debug('Database trying to connect.');
  MongoClient.connect(uri, (err, _db) => {
    if (err) {
      logger.error('Database failed to connect. - ', err.message);
    } else {
      logger.info('Database connected.');
      db = _db;
    }
    return callback(err, db);
  });
};

Database.getCollection = (collectionName) => {
  let collection = collections[collectionName];
  
  if (!collection) {
    collection = db.collection(collectionName);
    collections[collectionName] = collection;
  }
  
  return collection;
};

Database.dropCollections = (...theArgs) => {
  const lastIndex = theArgs.length - 1;
  const collectionsToDrop = [];
  let done;
  
  theArgs.forEach((arg, index) => {
    if (index === lastIndex && typeof arg === 'function') {
      done = arg;
    } else {
      const collection = self.getCollection(arg);
      if (collection) {
        collectionsToDrop.push(collection);
      }
    }
  });
  
  if (done) {
    async.each(collectionsToDrop, (collectionDrop, callback) => {
      collectionDrop.drop(() => {
        callback();
      });
    }, done);
  }
};

Database.close = (callback) => {
  logger.debug('Database trying to disconnect');
  
  if (db) {
    db.close((err) => {
      if (err) {
        logger.error('Error on closing database');
      } else {
        logger.info('Database disconnected');
      }
      callback(err);
    });
  }
};

module.exports = Database;
