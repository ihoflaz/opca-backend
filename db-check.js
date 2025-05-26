const mongoose = require('mongoose');

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca';

// Modelleri import et
const User = require('./src/models/user.model');
const Analysis = require('./src/models/analysis.model');
const Parasite = require('./src/models/parasite.model');
const Digit = require('./src/models/digit.model');

async function analyzeDatabase() {
  try {
    console.log('=== OpCa Veritabanı Analiz Raporu ===\n');
    
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı\n');
    
    // 1. Koleksiyon sayıları
    console.log('1. Koleksiyon Kayıt Sayıları:');
    console.log('-----------------------------');
    
    const userCount = await User.countDocuments();
    const analysisCount = await Analysis.countDocuments();
    const parasiteCount = await Parasite.countDocuments();
    const digitCount = await Digit.countDocuments();
    
    console.log(`Users: ${userCount} kayıt`);
    console.log(`Analyses: ${analysisCount} kayıt`);
    console.log(`Parasites: ${parasiteCount} kayıt`);
    console.log(`Digits: ${digitCount} kayıt\n`);
    
    // 2. Admin kullanıcı kontrolü
    console.log('2. Admin Kullanıcı:');
    console.log('------------------');
    
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
      console.log(`✅ Admin bulundu:`);
      console.log(`   - ID: ${admin._id}`);
      console.log(`   - Name: ${admin.name}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Role: ${admin.role}\n`);
      
      // 3. Admin'in analizleri
      console.log('3. Admin Kullanıcısının Analizleri:');
      console.log('----------------------------------');
      
      const adminAnalyses = await Analysis.countDocuments({ userId: admin._id });
      console.log(`Toplam analiz: ${adminAnalyses}`);
      
      if (adminAnalyses > 0) {
        // Analiz tiplerini kontrol et
        const parasiteAnalyses = await Analysis.countDocuments({ 
          userId: admin._id, 
          analysisType: 'Parasite' 
        });
        const mnistAnalyses = await Analysis.countDocuments({ 
          userId: admin._id, 
          analysisType: 'MNIST' 
        });
        
        console.log(`   - Parasite analizleri: ${parasiteAnalyses}`);
        console.log(`   - MNIST analizleri: ${mnistAnalyses}`);
        
        // ProcessedOnMobile durumunu kontrol et
        const mobileTrue = await Analysis.countDocuments({ 
          userId: admin._id, 
          processedOnMobile: true 
        });
        const mobileFalse = await Analysis.countDocuments({ 
          userId: admin._id, 
          processedOnMobile: false 
        });
        const mobileUndefined = await Analysis.countDocuments({ 
          userId: admin._id, 
          processedOnMobile: { $exists: false } 
        });
        
        console.log(`   - ProcessedOnMobile=true: ${mobileTrue}`);
        console.log(`   - ProcessedOnMobile=false: ${mobileFalse}`);
        console.log(`   - ProcessedOnMobile=undefined: ${mobileUndefined}`);
        
        // Örnek analiz kaydı
        console.log('\n4. Örnek Analiz Kaydı:');
        console.log('---------------------');
        
        const sampleAnalysis = await Analysis.findOne({ userId: admin._id });
        if (sampleAnalysis) {
          console.log(`   - ID: ${sampleAnalysis._id}`);
          console.log(`   - Type: ${sampleAnalysis.analysisType}`);
          console.log(`   - ProcessedOnMobile: ${sampleAnalysis.processedOnMobile}`);
          console.log(`   - CreatedAt: ${sampleAnalysis.createdAt}`);
          console.log(`   - ParasiteResults: ${sampleAnalysis.parasiteResults?.length || 0} sonuç`);
          console.log(`   - DigitResults: ${sampleAnalysis.digitResults?.length || 0} sonuç`);
        }
        
        // API'nin kullandığı filtreyi test et
        console.log('\n5. API Filtre Testi:');
        console.log('-------------------');
        
        // Filtre olmadan
        const allAnalyses = await Analysis.countDocuments({ userId: admin._id });
        console.log(`Filtre yok: ${allAnalyses} analiz`);
        
        // Sadece type filtresi
        const parasiteOnly = await Analysis.countDocuments({ 
          userId: admin._id, 
          analysisType: 'Parasite' 
        });
        console.log(`Type=Parasite: ${parasiteOnly} analiz`);
        
        // processedOnMobile=false filtresi (API'nin yaptığı)
        const mobileFilter = await Analysis.countDocuments({ 
          userId: admin._id, 
          processedOnMobile: false 
        });
        console.log(`ProcessedOnMobile=false: ${mobileFilter} analiz`);
        
        // Tüm analizleri listele (ilk 5)
        console.log('\n6. İlk 5 Analiz:');
        console.log('---------------');
        
        const analyses = await Analysis.find({ userId: admin._id })
          .sort({ createdAt: -1 })
          .limit(5);
          
        analyses.forEach((analysis, index) => {
          console.log(`   ${index + 1}. ID: ${analysis._id}`);
          console.log(`      Type: ${analysis.analysisType}`);
          console.log(`      Mobile: ${analysis.processedOnMobile}`);
          console.log(`      Date: ${analysis.createdAt}`);
        });
      }
    } else {
      console.log('❌ Admin kullanıcı bulunamadı!\n');
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
analyzeDatabase(); 