const nconf = require('nconf');

nconf.argv()
.env()
.file('conf/config.json');

module.exports = nconf;
