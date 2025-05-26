/**
 * AWS S3 istemcisi ve konfigürasyonu
 */
const { S3Client } = require('@aws-sdk/client-s3');
const awsConfig = require('./aws.config');

// S3 istemcisi oluştur
const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: awsConfig.credentials
});

module.exports = {
  s3Client,
  awsConfig
}; 