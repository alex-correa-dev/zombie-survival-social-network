const ROOT_PATH = process.cwd();

const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

module.exports = (callback) => {
  const filter = {};
  
  survivorsModel.find(filter, undefined, callback);
};
