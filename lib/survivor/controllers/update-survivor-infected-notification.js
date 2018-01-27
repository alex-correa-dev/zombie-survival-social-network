const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const survivorId = req.params.id;
  
  survivorServices.findSurvivor(survivorId, (errFind, survivor) => {
    let message;
    const maxNotificationsInfected = 3;
  
    if (errFind) {
      message = `Error finding survivor. ${errFind}`;
      logger.error(message);
    
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
    
    const survivorDataToUpdate = {
      numInfectedNotification: survivor.numInfectedNotification + 1
    };
    
    if (survivorDataToUpdate.numInfectedNotification === maxNotificationsInfected) {
      survivorDataToUpdate.infected = true;
    }
  
    survivorServices.updateSurvivorInfectedNotification(survivorId, survivorDataToUpdate, (errUpdate) => {
      if (errUpdate) {
        message = `Error updating survivor location at patch survivor. Err: ${errUpdate}`;
        logger.error(message);
      
        return res.status(httpStatus.internalServerErrorStatus).send(message);
      }
    
      res.status(httpStatus.okStatus).end();
    });
  });
};
