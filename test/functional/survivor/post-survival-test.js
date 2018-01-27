const ROOT_PATH = process.cwd();
const { assert } = require('chai');
const supertest = require('supertest');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const app = require(`${ROOT_PATH}/lib/application`);
const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const fixtures = require(`${ROOT_PATH}/test/utils/fixtures`);

describe('Post /api/survivor functional tests', () => {
  const SURVIVORS_COLLECTION_NAME = 'survivors';
  
  beforeEach((done) => {
    db.dropCollections(SURVIVORS_COLLECTION_NAME, done);
  });
  
  after((done) => {
    db.dropCollections(SURVIVORS_COLLECTION_NAME, done);
  });
  
  context('Success cases:', () => {
    it('Create a survivor by post', (done) => {
      const survivorData = fixtures.survivors.createFixture();
      supertest(app)
        .post('/api/survivor')
        .send(survivorData)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.okStatus, res.statusCode);
          
          const survivorCreated = res.body;
          assert.strictEqual(survivorData.name, survivorCreated.name);
          assert.strictEqual(survivorData.age, survivorCreated.age);
          assert.strictEqual(survivorData.gender, survivorCreated.gender);
          assert.deepEqual(survivorData.location, survivorCreated.location);
          assert.deepEqual(survivorData.inventory, survivorCreated.inventory);
          assert.strictEqual(survivorData.infected, survivorCreated.infected);
          assert.strictEqual(survivorData.numInfectedNotification, survivorCreated.numInfectedNotification);
          done();
        });
    });
  });
});
