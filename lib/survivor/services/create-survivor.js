const ROOT_PATH = process.cwd();
const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

const createSurvivor = (survivorData, callback) => {
  survivorsModel.insert(survivorData, callback);
};

module.exports = createSurvivor;
