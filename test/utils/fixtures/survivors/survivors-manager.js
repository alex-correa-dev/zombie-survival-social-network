const BASE_DIR = process.cwd();
const survivorsModel = require(`${BASE_DIR}/lib/survivor/survivor-model`);
const survivorFixture = require('./survivors-fixture');

exports.populate = (data, callback) => {
  const fixture = survivorFixture.create(data);
  
  survivorsModel.insert(fixture, callback);
};
