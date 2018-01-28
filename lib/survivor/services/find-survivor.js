const ROOT_PATH = process.cwd();
const { ObjectID } = require('mongodb');

const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

const findSurvivor = (survivorId, callback) => {
  const filter = { _id: new ObjectID(survivorId) };
  
  survivorsModel.findOne(filter, undefined, callback);
};

const findSurvivorsAndInfected = (callback) => {
  const filter = {};
  
  survivorsModel.find(filter, callback);
};

module.exports = {
  findSurvivor,
  findSurvivorsAndInfected
};
