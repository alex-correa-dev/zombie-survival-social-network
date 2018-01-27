const ROOT_PATH = process.cwd();
const { ObjectID } = require('mongodb');
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);
const middleware = {};

middleware.verifySurvivorIsInfected = (req, res, next) => {
  const survivorId = req.params.id;
  
  survivorsModel.findOne({ _id: new ObjectID(survivorId) }, undefined, (err, survivor) => {
    let message;
    
    if (err) {
      message = `Error finding survivor. ${err}`;
      logger.error(message);
      
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
    
    if (!Object.keys(survivor).length) {
      message = 'Survivor not found';
      logger.error(message);
  
      return res.status(httpStatus.notFoundStatus).send(message);
    }
    
    if (survivor.infected) {
      message = 'Error updating survivor because he/she was already infected';
      logger.error(message);
  
      return res.status(httpStatus.badRequestStatus).send(message);
    }
  
    return next();
  });
};

module.exports = middleware;
