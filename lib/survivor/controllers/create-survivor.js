const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const survivorData = req.body;
  
  survivorServices.createSurvivor(survivorData, (errCreate, survivor) => {
    if (errCreate) {
      logger.error('Error creating survivor at post survivor. Err:', errCreate);
      return res.status(httpStatus.internalServerErrorStatus).end();
    }
    return res.status(httpStatus.okStatus).send(survivor);
  });
};
