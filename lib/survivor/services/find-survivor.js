const ROOT_PATH = process.cwd();
const { ObjectID } = require('mongodb');

const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

module.exports = (survivorId, callback) => {
  const filter = { _id: new ObjectID(survivorId) };
  
  survivorsModel.findOne(filter, undefined, callback);
};
