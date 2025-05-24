const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const awsConfig = require('../config/aws.config');

// S3 istemcisini yapılandır
const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: awsConfig.credentials
});

// Alt klasörler
const FOLDERS = awsConfig.folders;

/**
 * Dosyayı S3'e yükle
 * @param {Buffer} fileBuffer Dosya buffer'ı
 * @param {String} fileName Dosya adı
 * @param {String} folder Alt klasör adı
 * @returns {Object} Yüklenen dosyanın bilgileri
 */
exports.uploadFile = async (fileBuffer, fileName, folder = '') => {
  try {
    // Dosya yolu oluştur
    const key = folder ? `${folder}/${fileName}` : fileName;

    // S3 parametreleri
    const params = {
      Bucket: awsConfig.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: getContentType(fileName)
    };

    // Dosyayı S3'e yükle
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Thumbnail oluştur ve yükle
    let thumbnailUrl = null;
    if (isImage(fileName)) {
      thumbnailUrl = await createAndUploadThumbnail(fileBuffer, fileName, folder);
    }

    // Ön imzalı URL oluştur
    const url = await getFileUrl(key);

    return {
      url,
      key,
      thumbnailUrl
    };
  } catch (error) {
    console.error('S3 dosya yükleme hatası:', error);
    throw new Error('Dosya yüklenirken bir hata oluştu');
  }
};

/**
 * S3'ten dosya URL'sini al (ön imzalı)
 * @param {String} key Dosya anahtarı
 * @param {Number} expiresIn Saniye cinsinden URL süresi (varsayılan: 3600)
 * @returns {String} Ön imzalı URL
 */
exports.getFileUrl = async (key, expiresIn = awsConfig.signedUrlExpiration) => {
  try {
    const command = new GetObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('S3 URL oluşturma hatası:', error);
    throw new Error('Dosya URL\'si oluşturulurken bir hata oluştu');
  }
};

/**
 * S3'ten dosyayı sil
 * @param {String} key Dosya anahtarı
 */
exports.deleteFile = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key
    });

    await s3Client.send(command);
    
    // Thumbnail'i de sil
    if (isImage(key)) {
      const thumbnailKey = getThumbnailKey(key);
      const thumbnailCommand = new DeleteObjectCommand({
        Bucket: awsConfig.bucketName,
        Key: thumbnailKey
      });
      
      await s3Client.send(thumbnailCommand);
    }
  } catch (error) {
    console.error('S3 dosya silme hatası:', error);
    throw new Error('Dosya silinirken bir hata oluştu');
  }
};

/**
 * Thumbnail oluştur ve S3'e yükle
 * @param {Buffer} fileBuffer Orijinal dosya buffer'ı
 * @param {String} fileName Dosya adı
 * @param {String} folder Alt klasör adı
 * @returns {String} Thumbnail URL
 */
const createAndUploadThumbnail = async (fileBuffer, fileName, folder = '') => {
  try {
    // Küçük boyutlu thumbnail oluştur
    const thumbnailBuffer = await sharp(fileBuffer)
      .resize(
        awsConfig.thumbnails.width, 
        awsConfig.thumbnails.height, 
        { fit: awsConfig.thumbnails.fit }
      )
      .jpeg({ quality: awsConfig.thumbnails.quality })
      .toBuffer();

    // Thumbnail dosya adı
    const thumbnailFileName = `thumb_${fileName}`;
    
    // Thumbnail için key
    const thumbnailKey = folder 
      ? `${FOLDERS.THUMBNAILS}/${folder}/${thumbnailFileName}`
      : `${FOLDERS.THUMBNAILS}/${thumbnailFileName}`;

    // S3 parametreleri
    const params = {
      Bucket: awsConfig.bucketName,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg'
    };

    // Thumbnail'i S3'e yükle
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Ön imzalı URL oluştur
    return await getFileUrl(thumbnailKey);
  } catch (error) {
    console.error('Thumbnail oluşturma hatası:', error);
    return null;
  }
};

/**
 * Thumbnail key'i oluştur
 * @param {String} key Orijinal dosya key'i
 * @returns {String} Thumbnail key
 */
const getThumbnailKey = (key) => {
  const pathParts = key.split('/');
  const fileName = pathParts.pop();
  const thumbnailFileName = `thumb_${fileName}`;
  
  return [...pathParts, FOLDERS.THUMBNAILS, thumbnailFileName].join('/');
};

/**
 * Dosya türüne göre content type belirle
 * @param {String} fileName Dosya adı
 * @returns {String} Content type
 */
const getContentType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
};

/**
 * Dosyanın resim olup olmadığını kontrol et
 * @param {String} fileName Dosya adı
 * @returns {Boolean} Dosya resim ise true, değilse false
 */
const isImage = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
};

// Alt klasörleri dışarı aktar
exports.FOLDERS = FOLDERS;

// getFileUrl fonksiyonunu da dışarı aktar
const getFileUrl = exports.getFileUrl; 