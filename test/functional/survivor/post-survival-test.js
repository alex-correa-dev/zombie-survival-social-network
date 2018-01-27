const ROOT_PATH = process.cwd();
const { assert } = require('chai');
const logger = require('winston');
const sinon = require('sinon');
const supertest = require('supertest');

const db = require(`${ROOT_PATH}/lib/commons/db`);
const app = require(`${ROOT_PATH}/lib/application`);
const { httpStatus } = require(`${ROOT_PATH}/lib/survivor/enums`);
const fixtures = require(`${ROOT_PATH}/test/utils/fixtures`);
const survivorServices = require(`${ROOT_PATH}/lib/survivor/services`);

describe('Post /api/survivor functional tests', () => {
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
    it('Create a survivor by post', (done) => {
      const survivorData = fixtures.survivors.createFixture();
      
      supertest(app)
        .post('/api/survivor')
        .send(survivorData)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.createdStatus, res.statusCode);
          
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
  
  context('Error cases', () => {
    it('Should return an error on trying create a survivor with wrong data', (done) => {
      const survivorData = fixtures.survivors.createFixture();
      delete survivorData.name;
      
      supertest(app)
        .post('/api/survivor')
        .send(survivorData)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.badRequestStatus, res.statusCode);
  
          const expectedError = 'Missing required property: name.';
          assert.strictEqual(res.text, expectedError);
          done();
        });
    });
  
    it('Should return an error because there is some problem at database', (done) => {
      const survivorData = fixtures.survivors.createFixture();
  
      sinon.stub(survivorServices, 'createSurvivor').callsFake((arg1, cb) => cb(new Error()));
      sandbox.spy(logger, 'error');
      
      supertest(app)
        .post('/api/survivor')
        .send(survivorData)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(httpStatus.internalServerErrorStatus, res.statusCode);
        
          assert.isDefined(res.error);
          sinon.assert.calledOnce(survivorServices.createSurvivor);
          sinon.assert.calledWith(logger.error, 'Error creating survivor at post survivor. Err:');
          done();
        });
    });
  });
});
