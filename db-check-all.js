const mongoose = require('mongoose');

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca';

// Modelleri import et
const User = require('./src/models/user.model');
const Analysis = require('./src/models/analysis.model');

async function checkAllAnalyses() {
  try {
    console.log('=== Tüm Analizlerin Kullanıcı Kontrolü ===\n');
    
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı\n');
    
    // Tüm kullanıcıları listele
    console.log('1. Tüm Kullanıcılar:');
    console.log('------------------');
    
    const users = await User.find({});
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ID: ${user._id}`);
      console.log(`      Name: ${user.name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Role: ${user.role}\n`);
    });
    
    // Tüm analizleri listele
    console.log('2. Tüm Analizler:');
    console.log('----------------');
    
    const analyses = await Analysis.find({}).sort({ createdAt: -1 });
    
    for (let i = 0; i < analyses.length; i++) {
      const analysis = analyses[i];
      
      // Bu analizin sahibi olan kullanıcıyı bul
      const owner = await User.findById(analysis.userId);
      
      console.log(`   ${i + 1}. Analiz ID: ${analysis._id}`);
      console.log(`      User ID: ${analysis.userId}`);
      console.log(`      Owner: ${owner ? owner.name + ' (' + owner.email + ')' : 'KULLANICI BULUNAMADI!'}`);
      console.log(`      Type: ${analysis.analysisType}`);
      console.log(`      ProcessedOnMobile: ${analysis.processedOnMobile}`);
      console.log(`      Date: ${analysis.createdAt}\n`);
    }
    
    // Kullanıcı bazında analiz sayıları
    console.log('3. Kullanıcı Bazında Analiz Sayıları:');
    console.log('------------------------------------');
    
    for (const user of users) {
      const userAnalysisCount = await Analysis.countDocuments({ userId: user._id });
      console.log(`   ${user.name} (${user.email}): ${userAnalysisCount} analiz`);
    }
    
    // Sahipsiz analizler
    console.log('\n4. Sahipsiz Analizler:');
    console.log('---------------------');
    
    const allUserIds = users.map(u => u._id);
    const orphanAnalyses = await Analysis.find({ 
      userId: { $nin: allUserIds } 
    });
    
    if (orphanAnalyses.length > 0) {
      console.log(`   ⚠️  ${orphanAnalyses.length} sahipsiz analiz bulundu:`);
      orphanAnalyses.forEach((analysis, index) => {
        console.log(`      ${index + 1}. ID: ${analysis._id}, UserID: ${analysis.userId}`);
      });
    } else {
      console.log('   ✅ Sahipsiz analiz bulunamadı');
    }
    
    console.log('\n=== Analiz Tamamlandı ===');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

// Scripti çalıştır
checkAllAnalyses(); 