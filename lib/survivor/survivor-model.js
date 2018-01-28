const ROOT_PATH = process.cwd();
const logger = require('winston');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const validation = require(`${ROOT_PATH}/lib/validation`);
const SURVIVORS_COLLECTION_NAME = 'survivors';
const SurvivorModel = {};

SurvivorModel.insert = (model, callback) => {
  const result = validation.validate(model, 'survivor');
  
  if (result.valid) {
    const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  
    survivors.insert(model, (err, resultInsert) => {
      if (err) {
        logger.error(`Insert survivor error: ${err}`);
        
        callback(err);
      } else {
        return callback(err, resultInsert.ops[0]);
      }
    });
  } else {
    logger.error(`Survivor is not valid: \n ${JSON.stringify(model)} -
      ${validation.formatErrorMessage(result)}`);
    callback(validation.getErrorMessages(result));
  }
};

SurvivorModel.findOne = (query, options = {}, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  
  survivors.findOne(query, options, (error, result) => callback(error, result || {}));
};

SurvivorModel.findOneAndUpdate = (filter, set, options, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  
  survivors.findOneAndUpdate(filter, set, options, (err, result) => {
    if (err) {
      logger.error(`findOneAndUpdate survivor error: ${err.message}`);
      
      callback(err);
    } else {
      callback(null, result.value);
    }
  });
};

SurvivorModel.find = (filter, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  survivors.find(filter).toArray((error, documents) => callback(error, documents));
};

module.exports = SurvivorModel;
