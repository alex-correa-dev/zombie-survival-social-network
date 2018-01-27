const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const survivorData = req.body;
  const survivorId = req.params.id;
  
  const locationData = {};
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
  
  if (survivorData.latitude) {
    locationData.latitude = survivorData.latitude;
  }
  
  if (survivorData.longitude) {
    locationData.longitude = survivorData.longitude;
  }
  
  survivorServices.updateSurvivorLocation(survivorId, locationData, (errUpdate) => {
    if (errUpdate) {
      message = `Error updating survivor location at patch survivor. Err: ${errUpdate}`;
      logger.error(message);
      
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
    
    res.status(httpStatus.okStatus).end();
  });
};
