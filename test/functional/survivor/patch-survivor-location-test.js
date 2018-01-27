const ROOT_PATH = process.cwd();
const { assert } = require('chai');
const logger = require('winston');
const { ObjectID } = require('mongodb');
const sinon = require('sinon');
const supertest = require('supertest');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const app = require(`${ROOT_PATH}/lib/application`);
const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);
const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const fixtures = require(`${ROOT_PATH}/test/utils/fixtures`);

describe('Patch /api/survivor/survivor_id/location functional tests', () => {
  const SURVIVORS_COLLECTION_NAME = 'survivors';
  let sandbox;
  
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  
  beforeEach((done) => {
    db.dropCollections(SURVIVORS_COLLECTION_NAME, done);
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  after((done) => {
    sandbox.restore();
    db.dropCollections(SURVIVORS_COLLECTION_NAME, done);
  });
  
  context('Success cases:', () => {
    it('Update a survivor location with a patch', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
      
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        assert.isNull(errPopulate);
        
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {
          latitude: -19.8157,
          longitude: -43.9542
        };
  
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.okStatus, res.statusCode);
  
            survivorsModel.findOne({ _id: new ObjectID(survivorId) }, undefined, (errFind, survivor) => {
              assert.isNull(errFind);
              
              assert.strictEqual(survivorCreated.name, survivor.name);
              assert.strictEqual(survivorCreated.age, survivor.age);
              assert.strictEqual(survivorCreated.gender, survivor.gender);
              assert.deepEqual(locationBeloHorizonte, survivor.location);
              assert.deepEqual(survivorCreated.inventory, survivor.inventory);
              assert.strictEqual(survivorCreated.infected, survivor.infected);
              assert.strictEqual(survivorCreated.numInfectedNotification, survivor.numInfectedNotification);
              done();
            });
          });
      });
    });
  });
});
