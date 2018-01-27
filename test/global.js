const ROOT_PATH = process.cwd();
const config = require(`${ROOT_PATH}/lib/config`);
const db = require(`${ROOT_PATH}/lib/commons/db`);

before((done) => {
  db.connect(config.get('MONGO_URL_TEST'), done);
});

after((done) => {
  const SURVIVORS_COLLECTION_NAME = 'survivors';
  
  db.dropCollections(SURVIVORS_COLLECTION_NAME, () => {
    db.close(done);
  });
});
