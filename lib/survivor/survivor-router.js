const ROOT_PATH = process.cwd();
const express = require('express');

const router = new express.Router();
const {
  createSurvivor,
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorsTradeSupplies
} = require(`${ROOT_PATH}/lib/survivor/controllers`);
const middleware = require(`${ROOT_PATH}/lib/middleware`);
const validateSchema = require(`${ROOT_PATH}/lib/validation`);

router.post('/api/survivor', validateSchema.survivor, createSurvivor);

router.patch(
  '/api/survivor/:id/location',
  middleware.verifySurvivorIsInfected,
  middleware.verifyLocationData,
  updateSurvivorLocation
);

router.patch(
  '/api/survivor/:id/denunciation/infected',
  middleware.verifySurvivorIsInfected,
  updateSurvivorInfectedNotification
);

router.patch(
  '/api/survivor/:firstSurvivorId/:secondSurvivorId/trade',
  middleware.verifyTwoSurvivorsAreInfected,
  updateSurvivorsTradeSupplies
);

module.exports = router;
