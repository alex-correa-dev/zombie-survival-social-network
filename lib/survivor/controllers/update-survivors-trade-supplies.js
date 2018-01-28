const ROOT_PATH = process.cwd();
const async = require('async');
const logger = require('winston');

const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

function verifyErrorSupplies(tradeData, firstSurvivor, secondSurvivor) {
  const errorSupplies = [];
  Object.keys(tradeData.receiveToYou).forEach((supply) => {
    if (tradeData.receiveToYou[supply] > firstSurvivor.inventory[supply]) {
      errorSupplies.push(`receiveToYou.${supply}: ${tradeData.receiveToYou[supply]} - survivor` +
        `: ${firstSurvivor.inventory[supply]}\n`);
    }
  });
  
  Object.keys(tradeData.giveToMe).forEach((supply) => {
    if (tradeData.giveToMe[supply] > secondSurvivor.inventory[supply]) {
      errorSupplies.push(`giveToMe.${supply}: ${tradeData.giveToMe[supply]} - survivor` +
        `: ${secondSurvivor.inventory[supply]}\n`);
    }
  });
  
  return errorSupplies;
}

function tradeItems(options) {
  let message;
  
  const {
    firstSurvivor,
    secondSurvivor,
    tradeData,
    firstSurvivorId,
    secondSurvivorId,
    res
  } = options;
  
  const firstSurvivorInventory = firstSurvivor.inventory;
  const secondSurvivorInventory = secondSurvivor.inventory;
  
  Object.keys(tradeData.giveToMe).forEach((supply) => {
    firstSurvivorInventory[supply] += tradeData.giveToMe[supply];
    secondSurvivorInventory[supply] -= tradeData.giveToMe[supply];
  });
  
  Object.keys(tradeData.receiveToYou).forEach((supply) => {
    firstSurvivorInventory[supply] -= tradeData.receiveToYou[supply];
    secondSurvivorInventory[supply] += tradeData.receiveToYou[supply];
  });
  
  async.series([
    (callback) => {
      survivorServices.updateSurvivorInventory(firstSurvivorId, firstSurvivorInventory, callback);
    },
    (callback) => {
      survivorServices.updateSurvivorInventory(secondSurvivorId, secondSurvivorInventory, callback);
    }
  ], (errUpdate) => {
    if (errUpdate) {
      message = `Error trade supplies. Err: ${errUpdate}`;
      logger.error(message);
      
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
    
    res.status(httpStatus.okStatus).end();
  });
}

module.exports = (req, res) => {
  const tradeData = req.body;
  const { firstSurvivorId, secondSurvivorId } = req.params;
  
  let message;
  
  async.series([
    (callback) => {
      survivorServices.findSurvivor(firstSurvivorId, callback);
    },
    (callback) => {
      survivorServices.findSurvivor(secondSurvivorId, callback);
    }
  ], (errFind, survivors) => {
    const firstSurvivorIndex = 0;
    const secondSurvivorIndex = 1;
    const firstSurvivor = survivors[firstSurvivorIndex];
    const secondSurvivor = survivors[secondSurvivorIndex];
    
    const errorSupplies = verifyErrorSupplies(tradeData, firstSurvivor, secondSurvivor);
  
    if (errorSupplies.length) {
      message = `Error trading supplies. Details:\n${errorSupplies.join('')}`;
      logger.error(message);
  
      return res.status(httpStatus.badRequestStatus).send(message);
    }
  
    const options = {
      firstSurvivor,
      secondSurvivor,
      tradeData,
      firstSurvivorId,
      secondSurvivorId,
      res
    };
    
    tradeItems(options);
  });
};
