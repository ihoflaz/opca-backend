const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca';

// Modelleri import et
const User = require('./src/models/user.model');
const Analysis = require('./src/models/analysis.model');
const Parasite = require('./src/models/parasite.model');
const Digit = require('./src/models/digit.model');

async function createDemoData() {
  try {
    console.log('=== OpCa Demo Veri Oluşturma Başlıyor ===\n');
    
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı\n');
    
    // Mevcut verileri temizle (isteğe bağlı)
    const clearExisting = true; // true yaparsanız mevcut veriler silinir
    
    if (clearExisting) {
      console.log('🗑️  Mevcut veriler temizleniyor...');
      await User.deleteMany({});
      await Analysis.deleteMany({});
      await Parasite.deleteMany({});
      await Digit.deleteMany({});
      console.log('✅ Mevcut veriler temizlendi\n');
    }
    
    // 1. PARASITES KOLEKSIYONU
    console.log('1. 📦 Parasites koleksiyonu doldruluyor...');
    
    const parasites = [
      {
        type: "Neosporosis",
        name: "Neospora caninum",
        description: "Neospora caninum, tek hücreli bir parazittir ve sığırlarda yavru atmaya sebep olur. Bu parazit, köpekler ve diğer kanidler tarafından taşınır ve sığırlara bulaşır.",
        treatment: "Neosporosis için spesifik bir tedavi bulunmamaktadır. Ancak bazı antiparaziter ilaçlar semptomları hafifletebilir.",
        preventionMeasures: [
          "Köpeklerle teması sınırlandırma",
          "Yem ve su kaynaklarını koruma",
          "Ölü doğan buzağıları uygun şekilde imha etme",
          "Çiftlik hijyenini sağlama"
        ],
        imageUrls: [
          "https://opca-bucket.s3.amazonaws.com/parasites/neospora1.jpg",
          "https://opca-bucket.s3.amazonaws.com/parasites/neospora2.jpg"
        ],
        examples: [
          {
            imageUrl: "https://opca-bucket.s3.amazonaws.com/parasites/examples/neospora_example1.jpg",
            description: "Mikroskop altında Neospora caninum kisti"
          }
        ]
      },
      {
        type: "Echinococcosis",
        name: "Echinococcus granulosus",
        description: "Kist hidatik hastalığına neden olan parazit türüdür. İnsanlarda ve hayvanlarda ciddi sağlık sorunlarına yol açabilir.",
        treatment: "Cerrahi müdahale ve antiparaziter ilaçlar kullanılır. Albendazol ve mebendazol yaygın olarak kullanılır.",
        preventionMeasures: [
          "Köpeklerin düzenli parazit tedavisi",
          "Hijyen kurallarına uyma",
          "Çiğ et tüketiminden kaçınma",
          "Su kaynaklarının korunması"
        ],
        imageUrls: [
          "https://opca-bucket.s3.amazonaws.com/parasites/echino1.jpg"
        ],
        examples: [
          {
            imageUrl: "https://opca-bucket.s3.amazonaws.com/parasites/examples/echino_example1.jpg",
            description: "Echinococcus granulosus kist yapısı"
          }
        ]
      },
      {
        type: "Coenurosis",
        name: "Taenia multiceps",
        description: "Beyin ve omurilik kistlerine neden olan parazit türüdür. Koyun ve keçilerde yaygın görülür.",
        treatment: "Cerrahi müdahale gerekebilir. Erken teşhis önemlidir.",
        preventionMeasures: [
          "Köpeklerin tedavisi",
          "Hijyen önlemleri",
          "Enfekte hayvanların izolasyonu",
          "Düzenli veteriner kontrolü"
        ],
        imageUrls: [
          "https://opca-bucket.s3.amazonaws.com/parasites/coenurus1.jpg"
        ],
        examples: [
          {
            imageUrl: "https://opca-bucket.s3.amazonaws.com/parasites/examples/coenurus_example1.jpg",
            description: "Coenurus cerebralis kisti"
          }
        ]
      },
      {
        type: "Toxoplasmosis",
        name: "Toxoplasma gondii",
        description: "Kediler tarafından taşınan ve birçok memeli türünü etkileyen parazit.",
        treatment: "Sulfadiazin ve pirimetamin kombinasyonu kullanılır.",
        preventionMeasures: [
          "Kedi dışkısından kaçınma",
          "Çiğ et tüketmeme",
          "El hijyenine dikkat etme"
        ],
        imageUrls: [
          "https://opca-bucket.s3.amazonaws.com/parasites/toxoplasma1.jpg"
        ],
        examples: []
      },
      {
        type: "Cryptosporidiosis",
        name: "Cryptosporidium parvum",
        description: "Su kaynaklı enfeksiyonlara neden olan parazit türü.",
        treatment: "Nitazoxanide kullanılabilir, destekleyici tedavi önemli.",
        preventionMeasures: [
          "Temiz su kullanımı",
          "Hijyen kurallarına uyma",
          "Enfekte hayvanlardan uzak durma"
        ],
        imageUrls: [
          "https://opca-bucket.s3.amazonaws.com/parasites/crypto1.jpg"
        ],
        examples: []
      }
    ];
    
    try {
      await Parasite.insertMany(parasites);
      console.log(`✅ ${parasites.length} parazit kaydı eklendi`);
    } catch (e) {
      console.log(`❌ Parasites hatası: ${e.message}`);
    }
    
    // 2. DIGITS KOLEKSIYONU
    console.log('\n2. 🔢 Digits koleksiyonu doldruluyor...');
    
    const digits = [];
    for (let i = 0; i <= 9; i++) {
      digits.push({
        value: i,
        description: `${i} rakamı - MNIST veri setinde kullanılan el yazısı rakam örneği`,
        examples: [
          {
            imageUrl: `https://opca-bucket.s3.amazonaws.com/digits/examples/digit_${i}_example1.jpg`,
            description: `El yazısı ${i} örneği - standart yazım`
          },
          {
            imageUrl: `https://opca-bucket.s3.amazonaws.com/digits/examples/digit_${i}_example2.jpg`,
            description: `El yazısı ${i} örneği - farklı yazım stili`
          }
        ]
      });
    }
    
    try {
      await Digit.insertMany(digits);
      console.log(`✅ ${digits.length} rakam kaydı eklendi`);
    } catch (e) {
      console.log(`❌ Digits hatası: ${e.message}`);
    }
    
    // 3. USERS KOLEKSIYONU
    console.log('\n3. 👥 Users koleksiyonu doldruluyor...');
    
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const users = [
      // Admin kullanıcıları
      { name: "Admin Kullanıcı", email: "admin@example.com", password: hashedPassword, role: "admin" },
      { name: "Sistem Yöneticisi", email: "sysadmin@opca.com", password: hashedPassword, role: "admin" },
      
      // Veteriner hekim kullanıcıları
      { name: "Dr. Ahmet Yılmaz", email: "ahmet.yilmaz@vet.com", password: hashedPassword, role: "veterinarian" },
      { name: "Dr. Ayşe Demir", email: "ayse.demir@vet.com", password: hashedPassword, role: "veterinarian" },
      { name: "Dr. Mehmet Kaya", email: "mehmet.kaya@vet.com", password: hashedPassword, role: "veterinarian" },
      { name: "Dr. Fatma Özkan", email: "fatma.ozkan@vet.com", password: hashedPassword, role: "veterinarian" },
      { name: "Dr. Ali Çelik", email: "ali.celik@vet.com", password: hashedPassword, role: "veterinarian" },
      { name: "Dr. Zeynep Arslan", email: "zeynep.arslan@vet.com", password: hashedPassword, role: "veterinarian" },
      
      // Normal kullanıcılar
      { name: "Mustafa Koç", email: "mustafa.koc@gmail.com", password: hashedPassword, role: "user" },
      { name: "Elif Şahin", email: "elif.sahin@gmail.com", password: hashedPassword, role: "user" },
      { name: "Burak Yıldız", email: "burak.yildiz@gmail.com", password: hashedPassword, role: "user" },
      { name: "Seda Aydın", email: "seda.aydin@gmail.com", password: hashedPassword, role: "user" },
      { name: "Emre Polat", email: "emre.polat@gmail.com", password: hashedPassword, role: "user" },
      { name: "Gizem Erdoğan", email: "gizem.erdogan@gmail.com", password: hashedPassword, role: "user" },
      { name: "Oğuz Kılıç", email: "oguz.kilic@gmail.com", password: hashedPassword, role: "user" },
      { name: "Merve Güneş", email: "merve.gunes@gmail.com", password: hashedPassword, role: "user" },
      { name: "Kemal Öztürk", email: "kemal.ozturk@gmail.com", password: hashedPassword, role: "user" },
      { name: "Deniz Yılmaz", email: "deniz.yilmaz@gmail.com", password: hashedPassword, role: "user" },
      { name: "Ceren Aktaş", email: "ceren.aktas@gmail.com", password: hashedPassword, role: "user" },
      { name: "Barış Çetin", email: "baris.cetin@gmail.com", password: hashedPassword, role: "user" },
      { name: "İrem Koçak", email: "irem.kocak@gmail.com", password: hashedPassword, role: "user" },
      { name: "Arda Şen", email: "arda.sen@gmail.com", password: hashedPassword, role: "user" }
    ];
    
    let insertedUsers = [];
    try {
      insertedUsers = await User.insertMany(users);
      console.log(`✅ ${users.length} kullanıcı kaydı eklendi`);
    } catch (e) {
      console.log(`❌ Users hatası: ${e.message}`);
    }
    
    // 4. ANALYSES KOLEKSIYONU
    console.log('\n4. 🔬 Analyses koleksiyonu doldruluyor...');
    
    const allUsers = await User.find({});
    const userIds = allUsers.map(user => user._id);
    
    // Parazit türleri
    const parasiteTypes = ["Neosporosis", "Echinococcosis", "Coenurosis", "Toxoplasmosis", "Cryptosporidiosis"];
    
    // Şehirler
    const cities = ["Ankara", "İstanbul", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri"];
    
    // Cihaz bilgileri
    const devices = [
      "Android 13 / Samsung Galaxy S22",
      "Android 12 / Xiaomi Mi 11",
      "iOS 16.5 / iPhone 14 Pro",
      "iOS 15.7 / iPhone 13",
      "Android 11 / OnePlus 9",
      "iOS 16.1 / iPhone 12",
      "Android 13 / Google Pixel 7"
    ];
    
    const analyses = [];
    
    // Her kullanıcı için rastgele sayıda analiz oluştur
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const analysisCount = Math.floor(Math.random() * 15) + 5; // 5-20 arası analiz
      
      for (let j = 0; j < analysisCount; j++) {
        const isParasite = Math.random() > 0.3; // %70 parazit, %30 MNIST
        const processedOnMobile = Math.random() > 0.4; // %60 mobil, %40 server
        const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        
        let analysis = {
          userId: userId,
          analysisType: isParasite ? "Parasite" : "MNIST",
          imageUrl: `https://opca-bucket.s3.amazonaws.com/analyses/${isParasite ? 'parasite' : 'mnist'}_${Date.now()}_${j}.jpg`,
          rawImageKey: `analyses/${isParasite ? 'parasite' : 'mnist'}_${Date.now()}_${j}.jpg`,
          processedImageKey: `analyses/thumb_${isParasite ? 'parasite' : 'mnist'}_${Date.now()}_${j}.jpg`,
          processingTimeMs: Math.floor(Math.random() * 500) + 100,
          processedOnMobile: processedOnMobile,
          modelName: isParasite ? 
            (processedOnMobile ? "parasite-mobilenet-v1" : "parasite-server-model") :
            (processedOnMobile ? "mnist-convnet-v1" : "mnist-server-model"),
          modelVersion: "1.0.0",
          deviceInfo: processedOnMobile ? devices[Math.floor(Math.random() * devices.length)] : "Server",
          createdAt: randomDate,
          parasiteResults: [],
          digitResults: []
        };
        
        if (isParasite) {
          // Parazit analizi
          analysis.location = `${cities[Math.floor(Math.random() * cities.length)]}, Türkiye`;
          analysis.notes = `Parazit analizi - ${Math.random() > 0.5 ? 'Rutin kontrol' : 'Şüpheli vaka'}`;
          
          // Rastgele parazit sonuçları
          const resultCount = Math.floor(Math.random() * 3) + 1;
          const shuffledParasites = [...parasiteTypes].sort(() => 0.5 - Math.random());
          let totalConfidence = 0;
          
          for (let k = 0; k < resultCount; k++) {
            const confidence = Math.random() * (1 - totalConfidence);
            analysis.parasiteResults.push({
              type: shuffledParasites[k],
              confidence: Math.round(confidence * 100) / 100
            });
            totalConfidence += confidence;
          }
          
          // Güven değerlerini normalize et
          const sum = analysis.parasiteResults.reduce((acc, result) => acc + result.confidence, 0);
          if (sum > 0) {
            analysis.parasiteResults = analysis.parasiteResults.map(result => ({
              ...result,
              confidence: Math.round((result.confidence / sum) * 100) / 100
            }));
          }
          
        } else {
          // MNIST analizi
          analysis.notes = `Rakam tanıma analizi - ${Math.random() > 0.5 ? 'Test verisi' : 'Gerçek veri'}`;
          
          // Rastgele rakam sonuçları
          const resultCount = Math.floor(Math.random() * 3) + 1;
          const usedDigits = [];
          let totalConfidence = 0;
          
          for (let k = 0; k < resultCount; k++) {
            let digit;
            do {
              digit = Math.floor(Math.random() * 10);
            } while (usedDigits.includes(digit));
            
            usedDigits.push(digit);
            const confidence = Math.random() * (1 - totalConfidence);
            analysis.digitResults.push({
              value: digit,
              confidence: Math.round(confidence * 100) / 100
            });
            totalConfidence += confidence;
          }
          
          // Güven değerlerini normalize et
          const sum = analysis.digitResults.reduce((acc, result) => acc + result.confidence, 0);
          if (sum > 0) {
            analysis.digitResults = analysis.digitResults.map(result => ({
              ...result,
              confidence: Math.round((result.confidence / sum) * 100) / 100
            }));
          }
        }
        
        analyses.push(analysis);
      }
    }
    
    try {
      // Analizleri küçük gruplar halinde ekle
      const batchSize = 100;
      let totalInserted = 0;
      
      for (let i = 0; i < analyses.length; i += batchSize) {
        const batch = analyses.slice(i, i + batchSize);
        await Analysis.insertMany(batch);
        totalInserted += batch.length;
        console.log(`   📊 ${totalInserted}/${analyses.length} analiz eklendi...`);
      }
      
      console.log(`✅ Toplam ${analyses.length} analiz kaydı eklendi`);
    } catch (e) {
      console.log(`❌ Analyses hatası: ${e.message}`);
    }
    
    // 5. ÖZET RAPOR
    console.log('\n=== 📋 ÖZET RAPOR ===');
    console.log(`👥 Kullanıcılar: ${await User.countDocuments()}`);
    console.log(`🔬 Analizler: ${await Analysis.countDocuments()}`);
    console.log(`🦠 Parazitler: ${await Parasite.countDocuments()}`);
    console.log(`🔢 Rakamlar: ${await Digit.countDocuments()}`);
    
    console.log('\n👥 Kullanıcı Rolleri:');
    const userRoles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    userRoles.forEach(role => {
      console.log(`   - ${role._id}: ${role.count} kullanıcı`);
    });
    
    console.log('\n🔬 Analiz Tipleri:');
    const analysisTypes = await Analysis.aggregate([
      { $group: { _id: "$analysisType", count: { $sum: 1 } } }
    ]);
    analysisTypes.forEach(type => {
      console.log(`   - ${type._id}: ${type.count} analiz`);
    });
    
    console.log('\n📱 İşlem Yeri:');
    const processingLocation = await Analysis.aggregate([
      { $group: { _id: "$processedOnMobile", count: { $sum: 1 } } }
    ]);
    processingLocation.forEach(location => {
      console.log(`   - ${location._id ? 'Mobil' : 'Server'}: ${location.count} analiz`);
    });
    
    console.log('\n🎉 Demo veriler başarıyla oluşturuldu!');
    console.log('\n📝 Tüm kullanıcıların şifresi: "password"');
    console.log('🔑 Admin hesapları:');
    console.log('   - admin@example.com');
    console.log('   - sysadmin@opca.com');
    
    console.log('\n=== Demo Veri Oluşturma Tamamlandı ===');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

// Scripti çalıştır
createDemoData(); 