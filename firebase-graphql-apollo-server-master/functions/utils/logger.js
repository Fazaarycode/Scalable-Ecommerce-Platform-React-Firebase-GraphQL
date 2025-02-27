const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'firebase-graphql',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      stream: process.stderr
    }
  ]
});

module.exports = logger; 