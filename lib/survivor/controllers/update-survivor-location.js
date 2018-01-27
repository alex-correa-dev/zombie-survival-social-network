const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const survivorData = req.body;
  const survivorId = req.params.id;
  
  const locationData = {};
  let message;
  
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
