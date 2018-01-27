const BASE_DIR = process.cwd();
const survivorsModel = require(`${BASE_DIR}/lib/survivor/survivor-model`);
const survivorFixture = require('./survivors-fixture');

exports.populate = (data, callback) => {
  const fixture = survivorsModel.create(data);
  
  survivorFixture.insert(fixture, callback);
};
