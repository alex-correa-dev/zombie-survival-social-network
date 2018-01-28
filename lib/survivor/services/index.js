const createSurvivor = require('./create-survivor');
const { findSurvivor, findSurvivorsAndInfected } = require('./find-survivor');
const {
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorInventory
} = require('./update-survivor');

module.exports = {
  createSurvivor,
  findSurvivor,
  findSurvivorsAndInfected,
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorInventory
};
