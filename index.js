const ROOT_PATH = process.cwd();
const logger = require('winston');

const app = require(`${ROOT_PATH}/lib/application`);
const config = require(`${ROOT_PATH}/lib/config`);
const database = require(`${ROOT_PATH}/lib/commons/db`);

process.title = require('./package.json').name;

database.connect(config.get('MONGO_URL'), (err) => {
  if (err) {
    logger.error('Shutdown the application because an error occurred ' +
      'when connecting to database');
    process.exit(1);
  }
});

const shutdown = () => {
  logger.warn('Server receive signal to shutdown.');
  process.exit(0);
};

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (er) => {
    logger.error(`uncaughtException caught the error: ${er.message}`);
    throw er;
  })
  .on('exit', (code) => {
    logger.info('Node process exit with code:', code);
    database.close();
  });

const server = app.listen(config.get('SERVER_PORT'), (err) => {
  if (err) {
    logger.error('Error on listening port. ', err.message);
  }
  
  logger.info(
    'Server starting at %s:%s.',
    server.address().address, server.address().port
  );
  
  server.on('close', () => {
    logger.info('Shutdown the application server');
  });
});

module.exports = server;
