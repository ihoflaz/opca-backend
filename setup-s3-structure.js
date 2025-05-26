const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// AWS S3 konfigürasyonu
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'opca-bucket';

/**
 * S3'te klasör oluştur (boş dosya yükleyerek)
 */
async function createFolder(folderPath) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: folderPath.endsWith('/') ? folderPath : folderPath + '/',
      Body: '',
      ContentType: 'application/x-directory'
    };

    await s3.upload(params).promise();
    console.log(`✅ Klasör oluşturuldu: ${folderPath}`);
  } catch (error) {
    console.error(`❌ Klasör oluşturulamadı: ${folderPath}`, error.message);
  }
}

/**
 * Placeholder görsel oluştur (Base64 encoded minimal PNG)
 */
function createPlaceholderImage(width = 300, height = 300, text = 'OpCa') {
  // Minimal SVG to Base64 conversion
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
            text-anchor="middle" dominant-baseline="middle" fill="#666">
        ${text}
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

/**
 * S3'e dosya yükle
 */
async function uploadFile(key, body, contentType = 'image/svg+xml') {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    console.log(`✅ Dosya yüklendi: ${key} -> ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error(`❌ Dosya yüklenemedi: ${key}`, error.message);
    return null;
  }
}

/**
 * Parazit örnek görsellerini oluştur
 */
async function createParasiteExamples() {
  const parasites = [
    { type: 'Neosporosis', name: 'Neospora caninum' },
    { type: 'Echinococcosis', name: 'Echinococcus granulosus' },
    { type: 'Coenurosis', name: 'Taenia multiceps' }
  ];

  for (const parasite of parasites) {
    // Ana parazit görseli
    const mainImage = createPlaceholderImage(400, 300, parasite.type);
    await uploadFile(`parasites/${parasite.type.toLowerCase()}.svg`, mainImage);

    // Örnek görseller
    for (let i = 1; i <= 3; i++) {
      const exampleImage = createPlaceholderImage(300, 200, `${parasite.type}\nÖrnek ${i}`);
      await uploadFile(`parasites/examples/${parasite.type.toLowerCase()}_example${i}.svg`, exampleImage);
    }
  }
}

/**
 * MNIST rakam örnek görsellerini oluştur
 */
async function createDigitExamples() {
  for (let digit = 0; digit <= 9; digit++) {
    // Ana rakam görseli
    const mainImage = createPlaceholderImage(200, 200, digit.toString());
    await uploadFile(`digits/digit_${digit}.svg`, mainImage);

    // Örnek görseller
    for (let i = 1; i <= 3; i++) {
      const exampleImage = createPlaceholderImage(150, 150, `${digit}\nÖrnek ${i}`);
      await uploadFile(`digits/examples/digit_${digit}_example${i}.svg`, exampleImage);
    }
  }
}

/**
 * Test analiz görsellerini oluştur
 */
async function createTestAnalysisImages() {
  // Test parazit analiz görselleri
  for (let i = 1; i <= 5; i++) {
    const parasiteImage = createPlaceholderImage(400, 300, `Parazit\nAnaliz ${i}`);
    await uploadFile(`analyses/parasite_analysis_${i}.svg`, parasiteImage);
    
    // Thumbnail
    const thumbnail = createPlaceholderImage(150, 112, `P${i}`);
    await uploadFile(`analyses/thumb_parasite_analysis_${i}.svg`, thumbnail);
  }

  // Test MNIST analiz görselleri
  for (let i = 1; i <= 5; i++) {
    const digitImage = createPlaceholderImage(200, 200, `Rakam\nAnaliz ${i}`);
    await uploadFile(`analyses/mnist_analysis_${i}.svg`, digitImage);
    
    // Thumbnail
    const thumbnail = createPlaceholderImage(100, 100, `M${i}`);
    await uploadFile(`analyses/thumb_mnist_analysis_${i}.svg`, thumbnail);
  }
}

/**
 * Ana setup fonksiyonu
 */
async function setupS3Structure() {
  console.log('🚀 OpCa S3 yapısı kuruluyor...\n');

  try {
    // Bucket'ın var olup olmadığını kontrol et
    try {
      await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
      console.log(`✅ Bucket mevcut: ${BUCKET_NAME}\n`);
    } catch (error) {
      console.error(`❌ Bucket bulunamadı: ${BUCKET_NAME}`);
      console.log('Lütfen önce S3 bucket\'ını oluşturun.\n');
      return;
    }

    // 1. Klasör yapısını oluştur
    console.log('📁 Klasörler oluşturuluyor...');
    const folders = [
      'parasites',
      'parasites/examples',
      'parasites/analyses',
      'digits',
      'digits/examples', 
      'digits/analyses',
      'analyses',
      'uploads',
      'thumbnails'
    ];

    for (const folder of folders) {
      await createFolder(folder);
    }

    console.log('\n🖼️ Örnek görseller oluşturuluyor...');
    
    // 2. Parazit örnek görsellerini oluştur
    console.log('🦠 Parazit görselleri...');
    await createParasiteExamples();

    // 3. MNIST rakam örnek görsellerini oluştur
    console.log('🔢 Rakam görselleri...');
    await createDigitExamples();

    // 4. Test analiz görsellerini oluştur
    console.log('🧪 Test analiz görselleri...');
    await createTestAnalysisImages();

    console.log('\n🎉 S3 yapısı başarıyla kuruldu!');
    console.log(`\n📋 Bucket URL: https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/`);
    
  } catch (error) {
    console.error('❌ Setup sırasında hata:', error);
  }
}

/**
 * S3 içeriğini listele
 */
async function listS3Contents() {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      MaxKeys: 100
    };

    const data = await s3.listObjectsV2(params).promise();
    
    console.log(`\n📋 ${BUCKET_NAME} içeriği:`);
    console.log('─'.repeat(50));
    
    if (data.Contents.length === 0) {
      console.log('Bucket boş');
      return;
    }

    // Klasörlere göre grupla
    const folders = {};
    data.Contents.forEach(obj => {
      const parts = obj.Key.split('/');
      const folder = parts.length > 1 ? parts[0] : 'root';
      
      if (!folders[folder]) {
        folders[folder] = [];
      }
      folders[folder].push(obj);
    });

    Object.keys(folders).sort().forEach(folder => {
      console.log(`\n📁 ${folder}/`);
      folders[folder].forEach(obj => {
        const size = (obj.Size / 1024).toFixed(1);
        console.log(`   📄 ${obj.Key} (${size} KB)`);
      });
    });

  } catch (error) {
    console.error('❌ S3 içeriği listelenemedi:', error.message);
  }
}

// Script çalıştırma
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      setupS3Structure();
      break;
    case 'list':
      listS3Contents();
      break;
    case 'clean':
      console.log('🧹 S3 temizleme özelliği henüz eklenmedi');
      break;
    default:
      console.log(`
🔧 OpCa S3 Kurulum Aracı

Kullanım:
  node setup-s3-structure.js setup    # S3 yapısını kur
  node setup-s3-structure.js list     # S3 içeriğini listele
  node setup-s3-structure.js clean    # S3'ü temizle (yakında)

Gereksinimler:
  - .env dosyasında AWS kimlik bilgileri
  - S3 bucket'ının önceden oluşturulmuş olması
      `);
  }
}

module.exports = {
  setupS3Structure,
  listS3Contents,
  createFolder,
  uploadFile
}; 