const ROOT_PATH = process.cwd();
const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);

const createConversation = (survivorData, callback) => {
  survivorsModel.insert(survivorData, callback);
};

module.exports = createConversation;
