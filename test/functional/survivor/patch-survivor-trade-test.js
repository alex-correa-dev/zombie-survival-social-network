const ROOT_PATH = process.cwd();
const async = require('async');
const { assert } = require('chai');
const logger = require('winston');
const { ObjectID } = require('mongodb');
const sinon = require('sinon');
const supertest = require('supertest');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const app = require(`${ROOT_PATH}/lib/application`);
const survivorsModel = require(`${ROOT_PATH}/lib/survivor/survivor-model`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);
const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const fixtures = require(`${ROOT_PATH}/test/utils/fixtures`);

describe('Patch /api/survivor/survivor1_id/survivor2_id/trade functional tests', () => {
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
    db.dropCollections(SURVIVORS_COLLECTION_NAME, done);
  });
  
  context('Success cases:', () => {
    it('Trade items between two survivors by patch', (done) => {
      const firstSurvivorData = {
        infected: false,
        numInfectedNotification: 0,
        inventory: {
          water: 2,
          medication: 6,
          ammunition: 1,
          food: 1
        }
      };
  
      const secondSurvivorData = {
        infected: false,
        numInfectedNotification: 0,
        inventory: {
          ammunition: 6,
          food: 10,
          water: 1,
          medication: 5,
        }
      };
  
      async.series([
        function(callback) {
          fixtures.survivors.populate(firstSurvivorData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(secondSurvivorData, callback);
        }
      ], (errPopulate, survivors) => {
        assert.isNull(errPopulate);
  
        const firstSurvivorIndex = 0;
        const secondSurvivorIndex = 1;
        const firstSurvivorCreated = survivors[firstSurvivorIndex];
        const secondSurvivorCreated = survivors[secondSurvivorIndex];
        
        const firstSurvivorId = firstSurvivorCreated._id.toString();
        const secondSurvivorId = secondSurvivorCreated._id.toString();
        
        const tradeData = {
          giveToMe: {
            ammunition: 6,
            food: 2
          },
          receiveToYou: {
            water: 1,
            medication: 4
          }
        };
  
        supertest(app)
          .patch(`/api/survivor/${firstSurvivorId}/${secondSurvivorId}/trade`)
          .send(tradeData)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.okStatus, res.statusCode);
  
            async.series([
              function(callback) {
                survivorsModel.findOne({ _id: new ObjectID(firstSurvivorId) }, undefined, callback);
              },
              function(callback) {
                survivorsModel.findOne({ _id: new ObjectID(secondSurvivorId) }, undefined, callback);
              }
            ], (errFind, survivorsUpdated) => {
              assert.isNull(errFind);
              const firstSurvivorUpdated = survivorsUpdated[firstSurvivorIndex];
              const secondSurvivorUpdated = survivorsUpdated[secondSurvivorIndex];
  
              assert.strictEqual(firstSurvivorCreated.name, firstSurvivorUpdated.name);
              assert.strictEqual(firstSurvivorCreated.age, firstSurvivorUpdated.age);
              assert.strictEqual(firstSurvivorCreated.gender, firstSurvivorUpdated.gender);
              assert.deepEqual(firstSurvivorCreated.location, firstSurvivorUpdated.location);
              assert.strictEqual(
                firstSurvivorCreated.inventory.ammunition + tradeData.giveToMe.ammunition,
                firstSurvivorUpdated.inventory.ammunition
              );
              assert.strictEqual(
                firstSurvivorCreated.inventory.food + tradeData.giveToMe.food,
                firstSurvivorUpdated.inventory.food
              );
              assert.strictEqual(
                firstSurvivorCreated.inventory.water - tradeData.receiveToYou.water,
                firstSurvivorUpdated.inventory.water
              );
              assert.strictEqual(
                firstSurvivorCreated.inventory.medication - tradeData.receiveToYou.medication,
                firstSurvivorUpdated.inventory.medication
              );
              assert.strictEqual(firstSurvivorCreated.infected, firstSurvivorUpdated.infected);
              assert.strictEqual(
                firstSurvivorCreated.numInfectedNotification,
                firstSurvivorUpdated.numInfectedNotification
              );
  
              assert.strictEqual(secondSurvivorCreated.name, secondSurvivorUpdated.name);
              assert.strictEqual(secondSurvivorCreated.age, secondSurvivorUpdated.age);
              assert.strictEqual(secondSurvivorCreated.gender, secondSurvivorUpdated.gender);
              assert.deepEqual(secondSurvivorCreated.location, secondSurvivorUpdated.location);
              assert.strictEqual(
                secondSurvivorCreated.inventory.ammunition - tradeData.giveToMe.ammunition,
                secondSurvivorUpdated.inventory.ammunition
              );
              assert.strictEqual(
                secondSurvivorCreated.inventory.food - tradeData.giveToMe.food,
                secondSurvivorUpdated.inventory.food
              );
              assert.strictEqual(
                secondSurvivorCreated.inventory.water + tradeData.receiveToYou.water,
                secondSurvivorUpdated.inventory.water
              );
              assert.strictEqual(
                secondSurvivorCreated.inventory.medication + tradeData.receiveToYou.medication,
                secondSurvivorUpdated.inventory.medication
              );
              assert.strictEqual(secondSurvivorCreated.infected, secondSurvivorUpdated.infected);
              assert.strictEqual(
                secondSurvivorCreated.numInfectedNotification,
                secondSurvivorUpdated.numInfectedNotification
              );
              
              done();
            });
          });
      });
    });
  });
  
  context('Error cases:', () => {
    it.only('Should return an error because first survivor is infected', (done) => {
      done();
    });
  
    it('Should return an error because second survivor is infected', (done) => {
      done();
    });
  
    it('Should return an error because there is some problem at database when ' +
      'survivorsModel.findOne is called', (done) => {
      done();
    });
  
    it('Should return an error because tradeData.giveToMe was not sended', (done) => {
      done();
    });
  
    it('Should return an error because tradeData.receiveToYou was not sended', (done) => {
      done();
    });
  
    it('Should return an error because tradeData.giveToMe is empty', (done) => {
      done();
    });
  
    it('Should return an error because tradeData.receiveToYou is empty', (done) => {
      done();
    });
  
    it('Should return an error because the supplies points are not the same', (done) => {
      done();
    });
  
    it('Should return an error because the supplies of both survivors are not sufficient', (done) => {
      done();
    });
  
    it('Should return an error because there is some problem at database when ' +
      'survivorServices.updateSurvivorInventory is called', (done) => {
      done();
    });
  });
});
