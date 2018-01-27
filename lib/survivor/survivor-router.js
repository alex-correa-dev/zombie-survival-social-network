const ROOT_PATH = process.cwd();
const express = require('express');

const router = new express.Router();
const controller = require(`${ROOT_PATH}/lib/survivor/controllers`);
const validateSchema = require(`${ROOT_PATH}/lib/validation`);


router.post('/api/survivor', validateSchema.survivor, controller.createSurvivor);

module.exports = router;
