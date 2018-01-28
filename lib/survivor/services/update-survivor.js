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

const updateSurvivorInfectedNotification = (survivorId, survivorDataToUpdate, callback) => {
  const filter = { _id: new ObjectID(survivorId) };
  const options = { returnOriginal: false };
  const setUpdate = {
    $set: {
      numInfectedNotification: survivorDataToUpdate.numInfectedNotification
    }
  };
  
  if (survivorDataToUpdate.infected) {
    setUpdate.$set.infected = survivorDataToUpdate.infected;
  }
  
  survivorsModel.findOneAndUpdate(filter, setUpdate, options, callback);
};

const updateSurvivorInventory = (survivorId, survivorInventoryToUpdate, callback) => {
  const filter = { _id: new ObjectID(survivorId) };
  const options = { returnOriginal: false };
  const setUpdate = {
    $set: {
      inventory: survivorInventoryToUpdate
    }
  };
  
  survivorsModel.findOneAndUpdate(filter, setUpdate, options, callback);
};

module.exports = {
  updateSurvivorLocation,
  updateSurvivorInfectedNotification,
  updateSurvivorInventory
};
