const ROOT_PATH = process.cwd();
const { assert } = require('chai');
const async = require('async');
const logger = require('winston');
const sinon = require('sinon');
const supertest = require('supertest');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const app = require(`${ROOT_PATH}/lib/application`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);
const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const fixtures = require(`${ROOT_PATH}/test/utils/fixtures`);

describe('GET /api/survivors/reports tests', () => {
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
    it('Get a complete report about survivors and infected people', (done) => {
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
  
      const firstInfectedData = {
        infected: true,
        numInfectedNotification: 3,
        inventory: {
          water: 4,
          medication: 4,
          ammunition: 2,
          food: 10
        }
      };
  
      const secondInfectedData = {
        infected: true,
        numInfectedNotification: 3,
        inventory: {
          ammunition: 7,
          food: 6,
          water: 0,
          medication: 2
        }
      };
  
      async.series([
        function(callback) {
          fixtures.survivors.populate(firstSurvivorData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(secondSurvivorData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(firstInfectedData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(secondInfectedData, callback);
        }
      ], (errPopulate) => {
        assert.isNull(errPopulate);
  
        supertest(app)
          .get('/api/survivors/reports')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.okStatus, res.statusCode);
  
            const expectedResult = 'Reports:\n\n' +
              'Percentage of infected survivors: 50%\n\n' +
              'Percentage of non-infected survivors: 50%\n\n' +
              'Average amount of each kind of resource by survivor:\n' +
              '4 ammunition per survivor\n' +
              '6.75 food per survivor\n' +
              '1.75 water per survivor\n' +
              '4.25 medication per survivor\n\n' +
              'Points lost because of infected survivor\n' +
              'ammunition: 9\n' +
              'food: 48\n' +
              'water: 16\n' +
              'medication: 12\n' +
              'Total of points lost: 85';
            assert.strictEqual(expectedResult, res.text);
            done();
          });
      });
    });
  });
  
  context('Error cases:', () => {
    it('Should return an error because there is any survivor', (done) => {
      sandbox.spy(logger, 'error');
      
      supertest(app)
        .get('/api/survivors/reports')
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
  
          const expectedMessage = 'Could not send report of survivors: there is any people left.';
          assert.strictEqual(expectedMessage, res.text);
          sinon.assert.calledWith(logger.error, expectedMessage);
          done();
        });
    });
  
    it('Should return an error because the database problem at survivorServices.findSurvivorsAndInfected' +
      ' call', (done) => {
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
  
      const firstInfectedData = {
        infected: true,
        numInfectedNotification: 3,
        inventory: {
          water: 4,
          medication: 4,
          ammunition: 2,
          food: 10
        }
      };
  
      const secondInfectedData = {
        infected: true,
        numInfectedNotification: 3,
        inventory: {
          ammunition: 7,
          food: 6,
          water: 0,
          medication: 2
        }
      };
  
      async.series([
        function(callback) {
          fixtures.survivors.populate(firstSurvivorData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(secondSurvivorData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(firstInfectedData, callback);
        },
        function(callback) {
          fixtures.survivors.populate(secondInfectedData, callback);
        }
      ], (errPopulate) => {
        assert.isNull(errPopulate);
  
        const error = new Error();
        const fakeService = sinon.stub(survivorServices, 'findSurvivorsAndInfected')
          .callsFake(cb => cb(error));
        sandbox.spy(logger, 'error');
        
        supertest(app)
          .get('/api/survivors/reports')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
    
            const expectedMessage = `Error getting report of survivors. Err: ${error}`;
            sinon.assert.calledOnce(survivorServices.findSurvivorsAndInfected);
            sinon.assert.calledWith(logger.error, expectedMessage);
            fakeService.restore();
            done();
          });
      });
    });
  });
});
