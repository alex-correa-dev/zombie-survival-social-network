const ROOT_PATH = process.cwd();
const async = require('async');
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

middleware.verifyLocationData = (req, res, next) => {
  const survivorData = req.body;
  
  let message;
  
  if (!survivorData || !survivorData.latitude || !survivorData.longitude) {
    message = 'Invalid data to update a survivor location. Required: latitute and longitude';
    logger.error(message);
    
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  if (typeof survivorData.longitude !== 'number') {
    message = 'Invalid data to update a survivor location. Longitude must be a number';
    logger.error(message);
    
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  if (typeof survivorData.latitude !== 'number') {
    message = 'Invalid data to update a survivor location. Latitude must be a number';
    logger.error(message);
    
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  return next();
};

middleware.verifyTwoSurvivorsAreInfected = (req, res, next) => {
  const { firstSurvivorId, secondSurvivorId } = req.params;
  
  async.series([
    function(callback) {
      survivorsModel.findOne({ _id: new ObjectID(firstSurvivorId) }, undefined, callback);
    },
    function(callback) {
      survivorsModel.findOne({ _id: new ObjectID(secondSurvivorId) }, undefined, callback);
    }
  ], (errFind, survivors) => {
    let message;
    
    if (errFind) {
      message = `Error finding survivor. ${errFind}`;
      logger.error(message);
    
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
  
    const firstSurvivorIndex = 0;
    const secondSurvivorIndex = 1;
    const firstSurvivor = survivors[firstSurvivorIndex];
    const secondSurvivor = survivors[secondSurvivorIndex];
    
    if (firstSurvivor.infected) {
      message = `Could not trade between survivors: ${firstSurvivor.name} is infected`;
      logger.error(message);
  
      return res.status(httpStatus.badRequestStatus).send(message);
    }
  
    if (firstSurvivor.infected) {
      message = `Could not trade between survivors: ${secondSurvivor.name} is infected`;
      logger.error(message);
    
      return res.status(httpStatus.badRequestStatus).send(message);
    }
    
    return next();
  });
};

module.exports = middleware;
