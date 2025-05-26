const path = require('path');
const fs = require('fs/promises');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws');
const config = require('../config');

class ModelService {
  constructor() {
    // Mevcut model versiyonları
    this.currentVersions = {
      'parasite': {
        'parasite-mobilenet': '1.0.0'
      },
      'mnist': {
        'mnist-convnet': '1.0.0'
      }
    };
  }

  /**
   * Kullanılabilir tüm model versiyonlarını ve güncel durumlarını listele
   * (Modeller uygulamaya gömülüdür, sadece versiyon bilgisi sağlanır)
   */
  async getAvailableModels() {
    return {
      parasite: [
        {
          name: 'parasite-mobilenet',
          currentVersion: '1.0.0',
          minAppVersion: '1.0.0',
          description: 'MobileNet tabanlı parazit tanıma modeli',
          lastUpdated: '2023-06-15'
        }
      ],
      mnist: [
        {
          name: 'mnist-convnet',
          currentVersion: '1.0.0',
          minAppVersion: '1.0.0',
          description: 'Konvolüsyonel sinir ağı tabanlı rakam tanıma modeli',
          lastUpdated: '2023-06-01'
        }
      ]
    };
  }
  
  /**
   * Model metadata bilgilerini getir
   */
  async getModelMetadata(category, modelName, version) {
    // S3 veya yerel depodan metadata dosyasını getir
    const key = `models/${category}/${modelName}/${version}/metadata.json`;
    
    try {
      const command = new GetObjectCommand({
        Bucket: config.aws.s3.bucketName,
        Key: key
      });
      
      const response = await s3Client.send(command);
      const data = await response.Body.transformToString();
      return JSON.parse(data);
    } catch (error) {
      // S3'ten alınamazsa yerel dosya sisteminden dene
      try {
        const localPath = path.join(__dirname, `../models/${category}/${modelName}/${version}/metadata.json`);
        const data = await fs.readFile(localPath, 'utf-8');
        return JSON.parse(data);
      } catch (fsError) {
        // Yerel dosya da yoksa default metadata döndür
        return this.getDefaultMetadata(category, modelName, version);
      }
    }
  }
  
  /**
   * Verilen model versiyonunun güncel olup olmadığını kontrol et
   */
  async isLatestVersion(category, modelName, version) {
    const currentVersion = this.currentVersions[category]?.[modelName];
    if (!currentVersion) return false;
    
    return version === currentVersion;
  }
  
  /**
   * Model güncellemesi gerekip gerekmediğini kontrol et
   */
  async checkModelUpdate(category, modelName, version) {
    const currentVersion = this.currentVersions[category]?.[modelName];
    if (!currentVersion) {
      return {
        updateAvailable: false,
        message: 'Model bulunamadı',
        currentVersion: null,
        yourVersion: version
      };
    }
    
    const isLatest = version === currentVersion;
    
    return {
      updateAvailable: !isLatest,
      message: isLatest ? 'Model güncel' : 'Yeni model versiyonu mevcut',
      currentVersion: currentVersion,
      yourVersion: version,
      // Eğer güncelleme varsa, yeni sürüm hakkında bilgiler
      updateInfo: !isLatest ? {
        releaseDate: '2023-06-15',
        changes: [
          'Model doğruluğu iyileştirildi',
          'Yeni parazit türleri eklendi'
        ],
        minAppVersion: '1.0.0'
      } : null
    };
  }
  
  /**
   * Varsayılan metadata bilgilerini döndür (gerçek veriler yoksa)
   */
  getDefaultMetadata(category, modelName, version) {
    if (category === 'parasite') {
      return {
        name: modelName,
        version: version,
        description: 'Parazit tanıma modeli',
        classes: ['Neosporosis', 'Echinococcosis', 'Coenurosis'],
        accuracy: 0.85,
        inputShape: [224, 224, 3],
        lastUpdated: '2023-06-15'
      };
    } else if (category === 'mnist') {
      return {
        name: modelName,
        version: version,
        description: 'MNIST rakam tanıma modeli',
        classes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        accuracy: 0.97,
        inputShape: [28, 28, 1],
        lastUpdated: '2023-06-01'
      };
    }
    
    return {
      name: modelName,
      version: version,
      description: 'Model metadata bulunamadı'
    };
  }
}

module.exports = new ModelService(); 