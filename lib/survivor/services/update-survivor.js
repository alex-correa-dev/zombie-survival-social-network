const ROOT_PATH = process.cwd();
const { ObjectID } = require('mongodb');

const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

const updateSurvivorLocation = (survivorId, locationData, callback) => {
  const filter = { _id: new ObjectID(survivorId) };
  const setUpdate = {
    $set: {
      location: locationData
    }
  };
  const options = { returnOriginal: false };
  
  survivorsModel.findOneAndUpdate(filter, setUpdate, options, callback);
};

module.exports = {
  updateSurvivorLocation
};
