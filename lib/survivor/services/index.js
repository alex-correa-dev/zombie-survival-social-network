const createSurvivor = require('./create-survivor');
const findSurvivor = require('./find-survivor');
const { updateSurvivorLocation, updateSurvivorInfectedNotification } = require('./update-survivor');

module.exports = {
  createSurvivor,
  findSurvivor,
  updateSurvivorLocation,
  updateSurvivorInfectedNotification
};
