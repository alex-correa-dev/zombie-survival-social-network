const createSurvivor = require('./create-survivor');
const findSurvivor = require('./find-survivor');
const {
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorInventory
} = require('./update-survivor');

module.exports = {
  createSurvivor,
  findSurvivor,
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorInventory
};
