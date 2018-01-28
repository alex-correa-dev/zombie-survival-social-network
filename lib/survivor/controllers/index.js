const createSurvivor = require('./create-survivor');
const updateSurvivorLocation = require('./update-survivor-location');
const updateSurvivorInfectedNotification = require('./update-survivor-infected-notification');
const updateSurvivorsTradeSupplies = require('./update-survivors-trade-supplies');

module.exports = {
  createSurvivor,
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorsTradeSupplies
};
