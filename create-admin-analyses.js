const mongoose = require('mongoose');

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca';

// Modelleri import et
const User = require('./src/models/user.model');
const Analysis = require('./src/models/analysis.model');

async function createAdminAnalyses() {
  try {
    console.log('=== Admin Kullanıcısı İçin Test Analizleri Oluşturuluyor ===\n');
    
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı\n');
    
    // Admin kullanıcıyı bul
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log('❌ Admin kullanıcı bulunamadı!');
      return;
    }
    
    console.log(`✅ Admin bulundu: ${admin.name} (${admin._id})\n`);
    
    // Test analizleri oluştur
    const testAnalyses = [
      {
        userId: admin._id,
        analysisType: 'Parasite',
        imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/admin-parasite-1.jpg',
        rawImageKey: 'analyses/admin-parasite-1.jpg',
        processedImageKey: 'analyses/thumb-admin-parasite-1.jpg',
        location: 'Ankara, Türkiye',
        notes: 'Admin test parazit analizi 1',
        parasiteResults: [
          { type: 'Neosporosis', confidence: 0.85 },
          { type: 'Echinococcosis', confidence: 0.10 },
          { type: 'Coenurosis', confidence: 0.05 }
        ],
        digitResults: [],
        processingTimeMs: 450,
        processedOnMobile: false,
        modelName: 'parasite-server-model',
        modelVersion: '1.0.0',
        deviceInfo: 'Server',
        createdAt: new Date('2024-01-15T10:30:00Z')
      },
      {
        userId: admin._id,
        analysisType: 'MNIST',
        imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/admin-mnist-1.jpg',
        rawImageKey: 'analyses/admin-mnist-1.jpg',
        processedImageKey: 'analyses/thumb-admin-mnist-1.jpg',
        notes: 'Admin test MNIST analizi 1',
        parasiteResults: [],
        digitResults: [
          { value: 7, confidence: 0.92 },
          { value: 1, confidence: 0.05 },
          { value: 9, confidence: 0.03 }
        ],
        processingTimeMs: 280,
        processedOnMobile: false,
        modelName: 'mnist-server-model',
        modelVersion: '1.0.0',
        deviceInfo: 'Server',
        createdAt: new Date('2024-01-16T14:20:00Z')
      },
      {
        userId: admin._id,
        analysisType: 'Parasite',
        imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/admin-parasite-2.jpg',
        rawImageKey: 'analyses/admin-parasite-2.jpg',
        processedImageKey: 'analyses/thumb-admin-parasite-2.jpg',
        location: 'İstanbul, Türkiye',
        notes: 'Admin test parazit analizi 2 - mobil',
        parasiteResults: [
          { type: 'Echinococcosis', confidence: 0.78 },
          { type: 'Neosporosis', confidence: 0.15 },
          { type: 'Coenurosis', confidence: 0.07 }
        ],
        digitResults: [],
        processingTimeMs: 320,
        processedOnMobile: true,
        modelName: 'parasite-mobile-model',
        modelVersion: '1.0.0',
        deviceInfo: 'Android 13 / Samsung Galaxy S22',
        createdAt: new Date('2024-01-17T09:15:00Z')
      },
      {
        userId: admin._id,
        analysisType: 'MNIST',
        imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/admin-mnist-2.jpg',
        rawImageKey: 'analyses/admin-mnist-2.jpg',
        processedImageKey: 'analyses/thumb-admin-mnist-2.jpg',
        notes: 'Admin test MNIST analizi 2 - mobil',
        parasiteResults: [],
        digitResults: [
          { value: 3, confidence: 0.89 },
          { value: 8, confidence: 0.08 },
          { value: 5, confidence: 0.03 }
        ],
        processingTimeMs: 195,
        processedOnMobile: true,
        modelName: 'mnist-mobile-model',
        modelVersion: '1.0.0',
        deviceInfo: 'iOS 16.5 / iPhone 14 Pro',
        createdAt: new Date('2024-01-18T16:45:00Z')
      },
      {
        userId: admin._id,
        analysisType: 'Parasite',
        imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/admin-parasite-3.jpg',
        rawImageKey: 'analyses/admin-parasite-3.jpg',
        processedImageKey: 'analyses/thumb-admin-parasite-3.jpg',
        location: 'İzmir, Türkiye',
        notes: 'Admin test parazit analizi 3',
        parasiteResults: [
          { type: 'Coenurosis', confidence: 0.91 },
          { type: 'Neosporosis', confidence: 0.06 },
          { type: 'Echinococcosis', confidence: 0.03 }
        ],
        digitResults: [],
        processingTimeMs: 380,
        processedOnMobile: false,
        modelName: 'parasite-server-model',
        modelVersion: '1.0.0',
        deviceInfo: 'Server',
        createdAt: new Date('2024-01-19T11:30:00Z')
      }
    ];
    
    console.log(`📝 ${testAnalyses.length} test analizi oluşturuluyor...\n`);
    
    // Analizleri veritabanına kaydet
    for (let i = 0; i < testAnalyses.length; i++) {
      const analysisData = testAnalyses[i];
      
      try {
        const analysis = new Analysis(analysisData);
        await analysis.save();
        
        console.log(`✅ ${i + 1}. Analiz oluşturuldu:`);
        console.log(`   - ID: ${analysis._id}`);
        console.log(`   - Type: ${analysis.analysisType}`);
        console.log(`   - ProcessedOnMobile: ${analysis.processedOnMobile}`);
        console.log(`   - Date: ${analysis.createdAt}\n`);
        
      } catch (error) {
        console.log(`❌ ${i + 1}. Analiz oluşturulamadı: ${error.message}\n`);
      }
    }
    
    // Sonuçları kontrol et
    const adminAnalysisCount = await Analysis.countDocuments({ userId: admin._id });
    console.log(`🎉 Admin kullanıcısının toplam analiz sayısı: ${adminAnalysisCount}`);
    
    console.log('\n=== Test Analizleri Başarıyla Oluşturuldu ===');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

// Scripti çalıştır
createAdminAnalyses(); 