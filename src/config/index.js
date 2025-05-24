/**
 * Konfigürasyon modüllerini tek bir noktadan dışa aktar
 */

const appConfig = require('./app.config');
const jwtConfig = require('./jwt.config');
const awsConfig = require('./aws.config');
const connectDatabase = require('./database.config');

module.exports = {
  app: appConfig,
  jwt: jwtConfig,
  aws: awsConfig,
  connectDatabase
}; 