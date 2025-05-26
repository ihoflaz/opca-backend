const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();

// AWS S3 konfigürasyonu
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'opca-bucket';

/**
 * Görsel dosyasını optimize et ve thumbnail oluştur
 */
async function processImage(inputPath, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 900,
    quality = 85,
    thumbnailWidth = 300,
    thumbnailHeight = 225
  } = options;

  try {
    // Ana görsel optimize et
    const optimizedImage = await sharp(inputPath)
      .resize(maxWidth, maxHeight, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toBuffer();

    // Thumbnail oluştur
    const thumbnail = await sharp(inputPath)
      .resize(thumbnailWidth, thumbnailHeight, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return {
      optimized: optimizedImage,
      thumbnail: thumbnail,
      originalSize: fs.statSync(inputPath).size,
      optimizedSize: optimizedImage.length,
      thumbnailSize: thumbnail.length
    };
  } catch (error) {
    console.error(`❌ Görsel işlenemedi: ${inputPath}`, error.message);
    return null;
  }
}

/**
 * S3'e dosya yükle
 */
async function uploadToS3(key, buffer, contentType = 'image/jpeg') {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000' // 1 yıl cache
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error(`❌ S3 yükleme hatası: ${key}`, error.message);
    return null;
  }
}

/**
 * Klasördeki tüm görselleri yükle
 */
async function uploadImagesFromFolder(localFolder, s3Folder, options = {}) {
  if (!fs.existsSync(localFolder)) {
    console.log(`⚠️ Klasör bulunamadı: ${localFolder}`);
    return [];
  }

  const files = fs.readdirSync(localFolder);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log(`⚠️ ${localFolder} klasöründe görsel dosyası bulunamadı`);
    return [];
  }

  const results = [];

  for (const file of imageFiles) {
    const localPath = path.join(localFolder, file);
    const fileName = path.parse(file).name;
    const s3Key = `${s3Folder}/${fileName}.jpg`;
    const thumbnailKey = `${s3Folder}/thumbnails/${fileName}_thumb.jpg`;

    console.log(`📤 Yükleniyor: ${file}`);

    // Görseli işle
    const processed = await processImage(localPath, options);
    if (!processed) continue;

    // Ana görseli yükle
    const mainUrl = await uploadToS3(s3Key, processed.optimized);
    
    // Thumbnail'i yükle
    const thumbUrl = await uploadToS3(thumbnailKey, processed.thumbnail);

    if (mainUrl && thumbUrl) {
      results.push({
        originalFile: file,
        mainUrl,
        thumbUrl,
        s3Key,
        thumbnailKey,
        originalSize: processed.originalSize,
        optimizedSize: processed.optimizedSize,
        thumbnailSize: processed.thumbnailSize,
        compressionRatio: ((processed.originalSize - processed.optimizedSize) / processed.originalSize * 100).toFixed(1)
      });

      console.log(`✅ ${file} yüklendi (${(processed.originalSize/1024).toFixed(1)}KB -> ${(processed.optimizedSize/1024).toFixed(1)}KB)`);
    }
  }

  return results;
}

/**
 * Parazit görsellerini yükle
 */
async function uploadParasiteImages() {
  console.log('🦠 Parazit görselleri yükleniyor...');
  
  const parasiteTypes = ['neosporosis', 'echinococcosis', 'coenurosis'];
  const allResults = [];

  for (const type of parasiteTypes) {
    const localFolder = `./sample-images/parasites/${type}`;
    const s3Folder = `parasites/examples`;
    
    const results = await uploadImagesFromFolder(localFolder, s3Folder, {
      maxWidth: 800,
      maxHeight: 600,
      thumbnailWidth: 200,
      thumbnailHeight: 150
    });

    allResults.push(...results);
  }

  return allResults;
}

/**
 * MNIST rakam görsellerini yükle
 */
async function uploadDigitImages() {
  console.log('🔢 MNIST rakam görselleri yükleniyor...');
  
  const allResults = [];

  for (let digit = 0; digit <= 9; digit++) {
    const localFolder = `./sample-images/digits/${digit}`;
    const s3Folder = `digits/examples`;
    
    const results = await uploadImagesFromFolder(localFolder, s3Folder, {
      maxWidth: 300,
      maxHeight: 300,
      thumbnailWidth: 100,
      thumbnailHeight: 100
    });

    allResults.push(...results);
  }

  return allResults;
}

/**
 * Örnek klasör yapısını oluştur
 */
function createSampleFolders() {
  console.log('📁 Örnek klasör yapısı oluşturuluyor...');

  const folders = [
    './sample-images',
    './sample-images/parasites',
    './sample-images/parasites/neosporosis',
    './sample-images/parasites/echinococcosis', 
    './sample-images/parasites/coenurosis',
    './sample-images/digits'
  ];

  // Rakam klasörleri
  for (let i = 0; i <= 9; i++) {
    folders.push(`./sample-images/digits/${i}`);
  }

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`✅ Klasör oluşturuldu: ${folder}`);
    }
  });

  // README dosyası oluştur
  const readmeContent = `# OpCa Örnek Görseller

Bu klasöre OpCa projesi için örnek görselleri ekleyebilirsiniz.

## Klasör Yapısı

### Parazit Görselleri
- \`parasites/neosporosis/\` - Neospora caninum görselleri
- \`parasites/echinococcosis/\` - Echinococcus granulosus görselleri  
- \`parasites/coenurosis/\` - Taenia multiceps görselleri

### MNIST Rakam Görselleri
- \`digits/0/\` - Sıfır rakamı görselleri
- \`digits/1/\` - Bir rakamı görselleri
- ... (0-9 arası tüm rakamlar)

## Desteklenen Formatlar
- JPG/JPEG
- PNG
- GIF
- BMP
- WebP

## Kullanım
Görselleri ilgili klasörlere koyup şu komutu çalıştırın:
\`\`\`bash
node upload-real-images.js upload
\`\`\`

Görseller otomatik olarak optimize edilip S3'e yüklenecektir.
`;

  fs.writeFileSync('./sample-images/README.md', readmeContent);
  console.log('✅ README.md oluşturuldu');
}

/**
 * Yükleme raporu oluştur
 */
function generateUploadReport(results) {
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimizedSize = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalThumbnailSize = results.reduce((sum, r) => sum + r.thumbnailSize, 0);
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const compressionRatio = (totalSaved / totalOriginalSize * 100).toFixed(1);

  console.log('\n📊 Yükleme Raporu');
  console.log('─'.repeat(50));
  console.log(`📁 Toplam dosya: ${results.length}`);
  console.log(`📏 Orijinal boyut: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🗜️ Optimize boyut: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🖼️ Thumbnail boyut: ${(totalThumbnailSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Tasarruf: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (%${compressionRatio})`);
  
  // Detaylı rapor dosyası oluştur
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      originalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
      optimizedSizeMB: (totalOptimizedSize / 1024 / 1024).toFixed(2),
      thumbnailSizeMB: (totalThumbnailSize / 1024 / 1024).toFixed(2),
      savedMB: (totalSaved / 1024 / 1024).toFixed(2),
      compressionRatio: compressionRatio + '%'
    },
    files: results
  };

  fs.writeFileSync('./upload-report.json', JSON.stringify(reportData, null, 2));
  console.log('📄 Detaylı rapor: upload-report.json');
}

/**
 * Ana yükleme fonksiyonu
 */
async function uploadAllImages() {
  console.log('🚀 OpCa görselleri S3\'e yükleniyor...\n');

  try {
    // Bucket kontrolü
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
    console.log(`✅ S3 Bucket: ${BUCKET_NAME}\n`);

    const allResults = [];

    // Parazit görsellerini yükle
    const parasiteResults = await uploadParasiteImages();
    allResults.push(...parasiteResults);

    // MNIST görsellerini yükle  
    const digitResults = await uploadDigitImages();
    allResults.push(...digitResults);

    if (allResults.length > 0) {
      generateUploadReport(allResults);
      console.log('\n🎉 Tüm görseller başarıyla yüklendi!');
    } else {
      console.log('\n⚠️ Yüklenecek görsel bulunamadı');
    }

  } catch (error) {
    console.error('❌ Yükleme hatası:', error.message);
  }
}

// Script çalıştırma
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'upload':
      uploadAllImages();
      break;
    case 'setup-folders':
      createSampleFolders();
      break;
    case 'test':
      console.log('🧪 Test modu - Sharp kütüphanesi kontrolü');
      sharp('./sample-images/README.md')
        .jpeg()
        .toBuffer()
        .then(() => console.log('✅ Sharp çalışıyor'))
        .catch(err => console.error('❌ Sharp hatası:', err.message));
      break;
    default:
      console.log(`
🖼️ OpCa Görsel Yükleme Aracı

Kullanım:
  node upload-real-images.js setup-folders    # Örnek klasörleri oluştur
  node upload-real-images.js upload          # Görselleri S3'e yükle
  node upload-real-images.js test            # Sharp kütüphanesini test et

Adımlar:
  1. npm install sharp aws-sdk (gerekli paketleri yükle)
  2. node upload-real-images.js setup-folders
  3. sample-images/ klasörüne görsellerinizi ekleyin
  4. node upload-real-images.js upload

Gereksinimler:
  - .env dosyasında AWS kimlik bilgileri
  - Sharp kütüphanesi (npm install sharp)
      `);
  }
}

module.exports = {
  uploadAllImages,
  uploadImagesFromFolder,
  processImage,
  createSampleFolders
}; 