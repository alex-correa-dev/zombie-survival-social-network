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

describe('Patch /api/survivor/survivor_id/denunciation/infected functional tests', () => {
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
    it('update the number of infected notification without set the survivor to infected', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        assert.isNull(errPopulate);
  
        const survivorId = survivorCreated._id.toString();
  
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.okStatus, res.statusCode);
    
            survivorsModel.findOne({ _id: new ObjectID(survivorId) }, undefined, (errFind, survivor) => {
              assert.isNull(errFind);
    
              assert.strictEqual(survivorCreated.name, survivor.name);
              assert.strictEqual(survivorCreated.age, survivor.age);
              assert.strictEqual(survivorCreated.gender, survivor.gender);
              assert.deepEqual(survivorCreated.location, survivor.location);
              assert.deepEqual(survivorCreated.inventory, survivor.inventory);
              assert.isFalse(survivor.infected);
              assert.strictEqual(
                survivorCreated.numInfectedNotification + 1,
                survivor.numInfectedNotification
              );
              done();
            });
          });
      });
    });
  
    it('update the number of infected notification setting the survivor to infected because ' +
      'numInfectedNotification is equal to 3', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 2
      };
  
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        assert.isNull(errPopulate);
    
        const survivorId = survivorCreated._id.toString();
    
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.okStatus, res.statusCode);
        
            survivorsModel.findOne({ _id: new ObjectID(survivorId) }, undefined, (errFind, survivor) => {
              assert.isNull(errFind);
          
              assert.strictEqual(survivorCreated.name, survivor.name);
              assert.strictEqual(survivorCreated.age, survivor.age);
              assert.strictEqual(survivorCreated.gender, survivor.gender);
              assert.deepEqual(survivorCreated.location, survivor.location);
              assert.deepEqual(survivorCreated.inventory, survivor.inventory);
              assert.isTrue(survivor.infected);
              assert.strictEqual(
                survivorCreated.numInfectedNotification + 1,
                survivor.numInfectedNotification
              );
              done();
            });
          });
      });
    });
  });
  
  context('Error cases:', () => {
    it('Error trying update a survivor because some error ocurred at database', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
    
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        assert.isNull(errPopulate);
      
        const survivorId = survivorCreated._id.toString();
      
        const error = new Error();
        const fakeService = sinon.stub(survivorServices, 'updateSurvivorInfectedNotification')
          .callsFake((arg1, arg2, cb) => cb(error));
        sandbox.spy(logger, 'error');
      
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
          
            const expectedMessage = `Error updating survivor location at patch survivor. Err: ${error}`;
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledOnce(survivorServices.updateSurvivorInfectedNotification);
            sinon.assert.calledWith(logger.error, expectedMessage);
            fakeService.restore();
            done();
          });
      });
    });
  
    it('Error trying update a survivor because some error ocurred at database when finding ' +
      'a survivor by service', (done) => {
      const survivorData = {
        infected: false,
        numInfectedNotification: 0
      };
    
      fixtures.survivors.populate(survivorData, (errPopulate, survivorCreated) => {
        assert.isNull(errPopulate);
      
        const survivorId = survivorCreated._id.toString();
      
        const error = new Error();
        const fakeService = sinon.stub(survivorServices, 'findSurvivor')
          .callsFake((arg1, cb) => cb(error));
        sandbox.spy(logger, 'error');
      
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
          
            const expectedMessage = `Error finding survivor. ${error}`;
            assert.strictEqual(expectedMessage, res.text);
            sinon.assert.calledOnce(survivorServices.findSurvivor);
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
      
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
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
      
        const error = new Error();
        const fakeModel = sinon.stub(survivorsModel, 'findOne').callsFake((arg1, arg2, cb) => cb(error));
        sandbox.spy(logger, 'error');
      
        supertest(app)
          .patch(`/api/survivor/${survivorId}/denunciation/infected`)
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
    
      sandbox.spy(logger, 'error');
    
      supertest(app)
        .patch(`/api/survivor/${survivorId}/denunciation/infected`)
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
