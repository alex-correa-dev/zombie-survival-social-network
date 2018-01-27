const ROOT_PATH = process.cwd();
const logger = require('winston');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const validation = require(`${ROOT_PATH}/lib/validation`);
const SURVIVORS_COLLECTION_NAME = 'survivors';
const SurvivorModel = {};

SurvivorModel.insert = (model, callback) => {
  const result = validation.validate(model, 'survivor');
  if (result.valid) {
    const conversations = db.getCollection(SURVIVORS_COLLECTION_NAME);
    conversations.insert(model, (err, resultInsert) => {
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

module.exports = SurvivorModel;
