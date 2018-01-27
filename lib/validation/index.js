const tv4 = require('tv4');
const survivorSchema = require('./schemas/survivor-schema');

const Validator = {};
const self = Validator;
const badRequestStatus = 400;

tv4.addSchema(survivorSchema);

Validator.getErrorMessages = (result) => {
  const errors = [];
  
  result.errors.forEach((error) => {
    errors.push(error.message);
  });
  
  return errors;
};

Validator.formatErrorMessage = (result) => {
  const errors = self.getErrorMessages(result);
  
  return `${errors.join('.\n')}.`;
};

Validator.validate = (json, schemaId) => tv4.validateMultiple(json, schemaId);

Validator.survivor = (req, res, next) => {
  const result = self.validate(req.body, survivorSchema);
  
  if (!result.valid) {
    return res.status(badRequestStatus).send(self.formatErrorMessage(result));
  }
  
  next();
};

module.exports = Validator;
