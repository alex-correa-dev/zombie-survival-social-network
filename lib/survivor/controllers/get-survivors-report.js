const ROOT_PATH = process.cwd();
const logger = require('winston');

const { httpStatus, itemsPoints } = require(`${ROOT_PATH}/lib/survivor/enums`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

function printReportData(options) {
  const {
    numberSurvivorsInfected,
    numberSurvivors,
    numberSurvivorsNonInfected,
    survivorsSupplies,
    survivorsSuppliesInfected,
    res
  } = options;
  
  let reportMessage = 'Reports:\n\n';
  
  reportMessage +=
    `Percentage of infected survivors: ${(numberSurvivorsInfected * 100) / numberSurvivors}%\n\n`;
  
  reportMessage +=
    `Percentage of non-infected survivors: ${(numberSurvivorsNonInfected * 100) / numberSurvivors}%\n\n`;
  
  reportMessage += 'Average amount of each kind of resource by survivor:\n';
  
  reportMessage += `${survivorsSupplies.ammunition / numberSurvivors} ammunition per survivor\n`;
  reportMessage += `${survivorsSupplies.food / numberSurvivors} food per survivor\n`;
  reportMessage += `${survivorsSupplies.water / numberSurvivors} water per survivor\n`;
  reportMessage += `${survivorsSupplies.medication / numberSurvivors} medication per survivor\n\n`;
  
  reportMessage += 'Points lost because of infected survivor\n';
  
  reportMessage += `ammunition: ${survivorsSuppliesInfected.ammunition * itemsPoints.ammunition}\n`;
  reportMessage += `food: ${survivorsSuppliesInfected.food * itemsPoints.food}\n`;
  reportMessage += `water: ${survivorsSuppliesInfected.water * itemsPoints.water}\n`;
  reportMessage += `medication: ${survivorsSuppliesInfected.medication * itemsPoints.medication}\n`;
  
  const pointsLost = (survivorsSuppliesInfected.ammunition * itemsPoints.ammunition) +
    (survivorsSuppliesInfected.food * itemsPoints.food) +
    (survivorsSuppliesInfected.water * itemsPoints.water) +
    (survivorsSuppliesInfected.medication * itemsPoints.medication);
  reportMessage += `Total of points lost: ${pointsLost}`;
  
  res.status(httpStatus.okStatus).send(reportMessage);
}

function generateSurvivorsReport(survivors, numberSurvivors, res) {
  let numberSurvivorsNonInfected = 0;
  let numberSurvivorsInfected = 0;
  const survivorsSupplies = {
    ammunition: 0,
    food: 0,
    water: 0,
    medication: 0
  };
  const survivorsSuppliesInfected = {
    ammunition: 0,
    food: 0,
    water: 0,
    medication: 0
  };
  
  survivors.forEach((survivor) => {
    if (survivor.infected) {
      numberSurvivorsInfected += 1;
      survivorsSuppliesInfected.ammunition += survivor.inventory.ammunition || 0;
      survivorsSuppliesInfected.food += survivor.inventory.food || 0;
      survivorsSuppliesInfected.water += survivor.inventory.water || 0;
      survivorsSuppliesInfected.medication += survivor.inventory.medication || 0;
    } else {
      numberSurvivorsNonInfected += 1;
    }
    
    survivorsSupplies.ammunition += survivor.inventory.ammunition || 0;
    survivorsSupplies.food += survivor.inventory.food || 0;
    survivorsSupplies.water += survivor.inventory.water || 0;
    survivorsSupplies.medication += survivor.inventory.medication || 0;
  });
  
  const options = {
    numberSurvivorsInfected,
    numberSurvivors,
    numberSurvivorsNonInfected,
    survivorsSupplies,
    survivorsSuppliesInfected,
    res
  };
  
  printReportData(options);
}

module.exports = (req, res) => {
  let message;
  
  survivorServices.findSurvivorsAndInfected((err, survivors) => {
    if (err) {
      message = `Error getting report of survivors. Err: ${err}`;
      logger.error(message);
    
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
  
    const numberSurvivors = survivors.length;
    
    if (!numberSurvivors) {
      message = 'Could not send report of survivors: there is any people left.';
      logger.error(message);
  
      return res.status(httpStatus.internalServerErrorStatus).send(message);
    }
  
    generateSurvivorsReport(survivors, numberSurvivors, res);
  });
};
