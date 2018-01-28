const Chance = require('chance');

const chance = new Chance();

const getInventory = () => ({
  water: chance.natural({ min: 0, max: 10 }),
  food: chance.natural({ min: 0, max: 10 }),
  medication: chance.natural({ min: 0, max: 10 }),
  ammunition: chance.natural({ min: 0, max: 10 })
});

const getLocation = () => ({
  latitude: chance.latitude(),
  longitude: chance.longitude()
});

const create = (data = {}) => {
  const survivor = {};
  
  survivor.name = data.name || chance.name();
  survivor.age = data.age || chance.age();
  survivor.gender = data.gender || chance.gender();
  survivor.location = data.location || getLocation();
  survivor.inventory = data.inventory || getInventory();
  survivor.infected = typeof data.infected === 'boolean' ? data.infected : chance.bool();
  survivor.numInfectedNotification = typeof data.numInfectedNotification === 'number' ?
    data.numInfectedNotification :
    chance.natural({ min: 0, max: 3 });
  
  return survivor;
};

module.exports = {
  create
};
