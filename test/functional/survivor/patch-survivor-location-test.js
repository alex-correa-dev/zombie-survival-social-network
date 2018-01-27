const ROOT_PATH = process.cwd();
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
  
  context('Error cases:', () => {
    it('Error trying update a survivor because location is empty', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {};
  
        sandbox.spy(logger, 'error');
  
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
    
            const expectedMessage = 'Invalid data to update a survivor location. Required: ' +
              'latitute and longitude';
    
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledWith(logger.error, expectedMessage);
    
            done();
          });
      });
    });
  
    it('Error trying update a survivor because it does not have latitude', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {
          longitude: -43.9542
        };
    
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
    
            const expectedMessage = 'Invalid data to update a survivor location. Required: ' +
              'latitute and longitude';
    
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledWith(logger.error, expectedMessage);
        
            done();
          });
      });
    });
  
    it('Error trying update a survivor because it does not have longitude', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {
          latitude: -19.8157
        };
    
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
  
            const expectedMessage = 'Invalid data to update a survivor location. Required: ' +
              'latitute and longitude';
  
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledWith(logger.error, expectedMessage);
        
            done();
          });
      });
    });
  
    it('Error trying update a survivor because latitude is not a number', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {
          latitude: 'Error',
          longitude: -43.9542
        };
    
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
        
            const expectedMessage = 'Invalid data to update a survivor location. Latitude must be a number';
            
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledWith(logger.error, expectedMessage);
        
            done();
          });
      });
    });
  
    it('Error trying update a survivor because longitude is not a number', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        const survivorId = survivorCreated._id.toString();
        const locationBeloHorizonte = {
          latitude: -19.8157,
          longitude: 'Error'
        };
    
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
        
            const expectedMessage = 'Invalid data to update a survivor location. Longitude must be a number';
        
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledWith(logger.error, expectedMessage);
        
            done();
          });
      });
    });
  
    it('Error trying update a survivor because some error ocurred at database', (done) => {
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
  
        const error = new Error();
        const fakeService = sinon.stub(survivorServices, 'updateSurvivorLocation')
          .callsFake((arg1, arg2, cb) => cb(error));
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
    
            const expectedMessage = `Error updating survivor location at patch survivor. Err: ${error}`;
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledOnce(survivorServices.updateSurvivorLocation);
            sinon.assert.calledWith(logger.error, expectedMessage);
            fakeService.restore();
            done();
          });
      });
    });
  
    it('Error trying update a survivor because he/she was already infected', (done) => {
      const survivorData = {
        infected: true,
        numInfectedNotification: 3
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
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
            assert.equal(httpStatus.badRequestStatus, res.statusCode);
      
            const expectedMessage = 'Error updating survivor because he/she was already infected';
            assert.strictEqual(expectedMessage, res.text);
            done();
          });
      });
    });
    
    it('Error trying update a survivor because there is an error at database when finding ' +
      'survivor at the middleware', (done) => {
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
    
        const error = new Error();
        const fakeModel = sinon.stub(survivorsModel, 'findOne').callsFake((arg1, arg2, cb) => cb(error));
        sandbox.spy(logger, 'error');
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/location`)
          .send(locationBeloHorizonte)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
        
            const expectedMessage = `Error finding survivor. ${error}`;
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledOnce(survivorsModel.findOne);
            sinon.assert.calledWith(logger.error, expectedMessage);
            fakeModel.restore();
            done();
          });
      });
    });
    
    it('Error trying update a survivor because there is not survivor with that id', (done) => {
      const survivorId = new ObjectID().toString();
      const locationBeloHorizonte = {
        latitude: -19.8157,
        longitude: -43.9542
      };
  
      sandbox.spy(logger, 'error');
  
      supertest(app)
        .patch(`/api/survivor/${survivorId}/location`)
        .send(locationBeloHorizonte)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.notFoundStatus, res.statusCode);
      
          const expectedMessage = 'Survivor not found';
          assert.strictEqual(expectedMessage, res.text);
          sinon.assert.calledWith(logger.error, expectedMessage);
          done();
        });
    });
  });
});
