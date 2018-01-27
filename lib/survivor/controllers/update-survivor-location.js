const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const survivorData = req.body;
  const survivorId = req.params.id;
  
  const locationData = {};
  
  if (!survivorData ||
    (!survivorData.latitude && !survivorData.longitude) ||
    typeof survivorData.latitude !== 'number' ||
    typeof survivorData.longitude !== 'number') {
    logger.error('Invalid data to update a survivor location. Required: latitute and longitude');
    
    return res.status(httpStatus.badRequestStatus).end();
  }
  
  if (survivorData.latitude) {
    locationData.latitude = survivorData.latitude;
  }
  
  if (survivorData.longitude) {
    locationData.longitude = survivorData.longitude;
  }
  
  survivorServices.updateSurvivorLocation(survivorId, locationData, (errUpdate) => {
    if (errUpdate) {
      logger.error('Error updating survivor location at patch survivor. Err:', errUpdate);
      
      return res.status(httpStatus.internalServerErrorStatus).end();
    }
    
    res.status(httpStatus.okStatus).end();
  });
};
