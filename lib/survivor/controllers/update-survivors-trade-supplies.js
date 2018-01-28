const ROOT_PATH = process.cwd();
const async = require('async');
const logger = require('winston');

const { httpStatus, itemsPoints } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

module.exports = (req, res) => {
  const tradeData = req.body;
  const { firstSurvivorId, secondSurvivorId } = req.params;
  
  let message;
  
  if (!tradeData.giveToMe || !tradeData.receiveToYou) {
    message = 'Data to trade is no correct: giveToMe and receiveToYou are required';
    logger.error(message);
  
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  if (!Object.keys(tradeData.giveToMe).length || !Object.keys(tradeData.receiveToYou).length) {
    message = 'Data to trade is no correct: giveToMe and receiveToYou must ' +
      'have ammunition, food, water or medication';
    logger.error(message);
  
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  const giveToMePoints = Object.keys(tradeData.giveToMe).reduce((acc, supply) =>
    acc + (itemsPoints[supply] * tradeData.giveToMe[supply]), 0);
  
  const receiveToYouPoints = Object.keys(tradeData.receiveToYou).reduce((acc, supply) =>
    acc + (itemsPoints[supply] * tradeData.receiveToYou[supply]), 0);
  
  if (giveToMePoints !== receiveToYouPoints) {
    message = 'It was not possible trade between survivors: points of supplies are not the same';
    logger.error(message);
  
    return res.status(httpStatus.badRequestStatus).send(message);
  }
  
  async.series([
    function(callback) {
      survivorServices.findSurvivor(firstSurvivorId, callback);
    },
    function(callback) {
      survivorServices.findSurvivor(secondSurvivorId, callback);
    }
  ], (errFind, survivors) => {
    const firstSurvivorIndex = 0;
    const secondSurvivorIndex = 1;
    const firstSurvivor = survivors[firstSurvivorIndex];
    const secondSurvivor = survivors[secondSurvivorIndex];
    
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
    
    if (errorSupplies.length) {
      message = `Error trading supplies. Details:\n${errorSupplies.join('')}`;
      logger.error(message);
  
      return res.status(httpStatus.badRequestStatus).send(message);
    }
  
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
      function(callback) {
        survivorServices.updateSurvivorInventory(firstSurvivorId, firstSurvivorInventory, callback);
      },
      function(callback) {
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
  });
};
