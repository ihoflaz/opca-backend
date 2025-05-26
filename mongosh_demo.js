// OpCa Demo Veritabanı Oluşturma Script'i
// MongoDB Shell (mongosh) ile çalıştırın

// Veritabanını oluştur veya var olana bağlan
use opca_db;

// Tüm koleksiyonları temizle (sadece demo amaçlı)
db.users.drop();
db.parasites.drop();
db.digits.drop();
db.analyses.drop();

// ----- KULLANICILAR -----
print("Kullanıcılar oluşturuluyor...");

// Admin kullanıcısı
db.users.insertOne({
  name: "Admin Kullanıcı",
  email: "admin@example.com",
  // Şifre: Admin123!
  password: "$2b$10$3QuzxF2YqwQFJZVNpDWXfeBNi69Z5NoNZMIzxmTx9FHNFJ/Wp3Fga",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Normal kullanıcı
db.users.insertOne({
  name: "Test Kullanıcı",
  email: "user@example.com",
  // Şifre: Test123!
  password: "$2b$10$Vvk3EzPWFaC6DDT/q1UPo.jvA.G8h2aDszO.ptCVbOSxqCv2GdHmG",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Veteriner kullanıcı (user modeline eklenmesi gereken yeni bir rol)
db.users.insertOne({
  name: "Dr. Ahmet Yılmaz",
  email: "vet@example.com",
  // Şifre: Vet123!
  password: "$2b$10$qE8T9Jp1Q7EZDxIJC10jNuNKg4z5QTIvL.bTLDiNB8.eDYFg4ZP0G",
  role: "veterinarian",
  createdAt: new Date(),
  updatedAt: new Date()
});

const adminId = db.users.findOne({email: "admin@example.com"})._id;
const userId = db.users.findOne({email: "user@example.com"})._id;
const vetId = db.users.findOne({email: "vet@example.com"})._id;

print(`Admin ID: ${adminId}`);
print(`User ID: ${userId}`);
print(`Vet ID: ${vetId}`);

// ----- PARAZİTLER -----
print("Parazit bilgileri oluşturuluyor...");

// Neosporosis
db.parasites.insertOne({
  type: "Neosporosis",
  name: "Neospora caninum",
  description: "Neospora caninum, tek hücreli bir parazittir ve sığırlarda yavru atmaya sebep olur. Dünya genelinde yaygın olarak görülür ve özellikle süt ineklerinde ekonomik kayıplara neden olur.",
  treatment: "Spesifik bir tedavi bulunmamaktadır, ancak bazı ilaçlar kullanılabilir. Genellikle korunma önlemleri daha etkilidir.",
  preventionMeasures: [
    "Köpeklerle teması sınırlandırma",
    "Yem ve su kaynaklarını koruma",
    "Ölü doğan buzağıları uygun şekilde imha etme",
    "Düzenli veteriner kontrolleri"
  ],
  imageUrls: [
    "https://opca-images.s3.amazonaws.com/parasites/neospora1.jpg",
    "https://opca-images.s3.amazonaws.com/parasites/neospora2.jpg"
  ],
  examples: [
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/neospora_example1.jpg",
      description: "Mikroskop altında Neospora caninum kisti"
    },
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/neospora_example2.jpg",
      description: "Enfekte dokuda Neospora caninum"
    }
  ],
  metadata: {
    prevalence: "Yüksek",
    hostSpecies: "Köpekler, Sığırlar",
    discoveryYear: "1984"
  },
  lastUpdated: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

// Echinococcosis
db.parasites.insertOne({
  type: "Echinococcosis",
  name: "Echinococcus granulosus",
  description: "Echinococcus granulosus, kist hidatik hastalığına neden olan bir tenya türüdür. İnsanlar ve hayvanlarda karaciğer ve akciğerlerde kistler oluşturabilir.",
  treatment: "Cerrahi müdahale ve anthelmintik ilaçlar (albendazole gibi) kullanılır. Tedavi süresi uzundur ve düzenli takip gerektirir.",
  preventionMeasures: [
    "Köpeklerin düzenli olarak ilaçlanması",
    "Çiğ et yemekten kaçınma",
    "Hijyen kurallarına uyma",
    "Enfekte organların uygun şekilde imha edilmesi"
  ],
  imageUrls: [
    "https://opca-images.s3.amazonaws.com/parasites/echinococcus1.jpg",
    "https://opca-images.s3.amazonaws.com/parasites/echinococcus2.jpg"
  ],
  examples: [
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/echinococcus_example1.jpg",
      description: "Echinococcus granulosus yumurtaları"
    },
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/echinococcus_example2.jpg",
      description: "Karaciğerde hidatik kist"
    }
  ],
  metadata: {
    prevalence: "Orta",
    hostSpecies: "Köpekler, Koyunlar, İnsanlar",
    discoveryYear: "1808"
  },
  lastUpdated: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

// Coenurosis
db.parasites.insertOne({
  type: "Coenurosis",
  name: "Taenia multiceps",
  description: "Taenia multiceps, Coenurosis hastalığına neden olan bir tenya türüdür. Koyun ve keçilerde merkezi sinir sistemini etkiler ve 'dönme hastalığı' olarak da bilinir.",
  treatment: "Cerrahi müdahale ile kistlerin çıkarılması gerekebilir. Erken tanı önemlidir.",
  preventionMeasures: [
    "Köpeklerin düzenli olarak ilaçlanması",
    "Enfekte hayvanların uygun şekilde imha edilmesi",
    "Çiğ et yemekten kaçınma",
    "Sürü yönetimi önlemleri"
  ],
  imageUrls: [
    "https://opca-images.s3.amazonaws.com/parasites/coenurosis1.jpg",
    "https://opca-images.s3.amazonaws.com/parasites/coenurosis2.jpg"
  ],
  examples: [
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/coenurosis_example1.jpg",
      description: "Koyun beyninde Coenurus cerebralis kisti"
    },
    {
      imageUrl: "https://opca-images.s3.amazonaws.com/examples/coenurosis_example2.jpg",
      description: "Taenia multiceps larvası"
    }
  ],
  metadata: {
    prevalence: "Düşük-Orta",
    hostSpecies: "Köpekler, Koyunlar, Keçiler",
    discoveryYear: "1905"
  },
  lastUpdated: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

// ----- RAKAMLAR -----
print("MNIST rakam bilgileri oluşturuluyor...");

// 0-9 arası tüm rakamlar için örnek veriler
for (let i = 0; i < 10; i++) {
  db.digits.insertOne({
    value: i,
    description: `${i} rakamı`,
    examples: [
      {
        imageUrl: `https://opca-images.s3.amazonaws.com/digits/digit_${i}_example1.jpg`,
        description: `El yazısı ${i} rakamı örneği 1`
      },
      {
        imageUrl: `https://opca-images.s3.amazonaws.com/digits/digit_${i}_example2.jpg`,
        description: `El yazısı ${i} rakamı örneği 2`
      }
    ],
    metadata: {
      category: "Doğal Sayı",
      complexity: i > 5 ? "Yüksek" : "Düşük",
      averageRecognitionRate: `${90 + Math.floor(Math.random() * 10)}%`
    },
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// ----- ANALİZ SONUÇLARI -----
print("Örnek analiz sonuçları oluşturuluyor...");

// Kullanıcı için parazit analiz örnekleri
for (let i = 0; i < 5; i++) {
  const parasiteTypes = ["Neosporosis", "Echinococcosis", "Coenurosis"];
  const mainParasite = parasiteTypes[Math.floor(Math.random() * parasiteTypes.length)];
  const secondParasite = parasiteTypes.filter(p => p !== mainParasite)[Math.floor(Math.random() * 2)];
  
  db.analyses.insertOne({
    userId: userId,
    analysisType: "Parasite",
    imageUrl: `https://opca-images.s3.amazonaws.com/analyses/parasite_analysis_${i+1}.jpg`,
    rawImageKey: `analyses/parasite_analysis_${i+1}.jpg`,
    processedImageKey: `thumbnails/parasite_analysis_${i+1}.jpg`,
    location: ["Ankara, Türkiye", "İstanbul, Türkiye", "İzmir, Türkiye"][Math.floor(Math.random() * 3)],
    notes: `Örnek parazit analizi ${i+1}`,
    parasiteResults: [
      { type: mainParasite, confidence: 0.7 + Math.random() * 0.25 },
      { type: secondParasite, confidence: Math.random() * 0.3 }
    ],
    processingTimeMs: 300 + Math.floor(Math.random() * 200),
    processedOnMobile: Math.random() > 0.5,
    modelName: "parasite-mobilenet",
    modelVersion: "1.0.0",
    deviceInfo: ["Android 13 / Samsung Galaxy S22", "iOS 16 / iPhone 14 Pro", "Android 12 / Xiaomi Mi 11"][Math.floor(Math.random() * 3)],
    isUploaded: true,
    uploadTimestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
  });
}

// Kullanıcı için MNIST analiz örnekleri
for (let i = 0; i < 5; i++) {
  const mainDigit = Math.floor(Math.random() * 10);
  let secondDigit;
  do {
    secondDigit = Math.floor(Math.random() * 10);
  } while (secondDigit === mainDigit);
  
  db.analyses.insertOne({
    userId: userId,
    analysisType: "MNIST",
    imageUrl: `https://opca-images.s3.amazonaws.com/analyses/mnist_analysis_${i+1}.jpg`,
    rawImageKey: `analyses/mnist_analysis_${i+1}.jpg`,
    processedImageKey: `thumbnails/mnist_analysis_${i+1}.jpg`,
    notes: `Örnek MNIST analizi ${i+1}`,
    digitResults: [
      { value: mainDigit, confidence: 0.8 + Math.random() * 0.15 },
      { value: secondDigit, confidence: Math.random() * 0.15 }
    ],
    processingTimeMs: 150 + Math.floor(Math.random() * 100),
    processedOnMobile: Math.random() > 0.5,
    modelName: "mnist-convnet",
    modelVersion: "1.0.0",
    deviceInfo: ["Android 13 / Samsung Galaxy S22", "iOS 16 / iPhone 14 Pro", "Android 12 / Xiaomi Mi 11"][Math.floor(Math.random() * 3)],
    isUploaded: true,
    uploadTimestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
  });
}

// Veteriner için parazit analiz örnekleri
for (let i = 0; i < 3; i++) {
  const parasiteTypes = ["Neosporosis", "Echinococcosis", "Coenurosis"];
  const mainParasite = parasiteTypes[Math.floor(Math.random() * parasiteTypes.length)];
  const secondParasite = parasiteTypes.filter(p => p !== mainParasite)[Math.floor(Math.random() * 2)];
  
  db.analyses.insertOne({
    userId: vetId,
    analysisType: "Parasite",
    imageUrl: `https://opca-images.s3.amazonaws.com/analyses/vet_parasite_analysis_${i+1}.jpg`,
    rawImageKey: `analyses/vet_parasite_analysis_${i+1}.jpg`,
    processedImageKey: `thumbnails/vet_parasite_analysis_${i+1}.jpg`,
    location: ["Ankara, Türkiye", "İstanbul, Türkiye", "İzmir, Türkiye"][Math.floor(Math.random() * 3)],
    notes: `Veteriner parazit analizi ${i+1}`,
    parasiteResults: [
      { type: mainParasite, confidence: 0.7 + Math.random() * 0.25 },
      { type: secondParasite, confidence: Math.random() * 0.3 }
    ],
    processingTimeMs: 300 + Math.floor(Math.random() * 200),
    processedOnMobile: true,
    modelName: "parasite-mobilenet",
    modelVersion: "1.0.0",
    deviceInfo: "iOS 16 / iPad Pro",
    isUploaded: true,
    uploadTimestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
  });
}

// İndeksleri oluştur
print("İndeksler oluşturuluyor...");

// User indeksleri
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Parasite indeksleri
db.parasites.createIndex({ type: 1 }, { unique: true });

// Digit indeksleri
db.digits.createIndex({ value: 1 }, { unique: true });

// Analysis indeksleri
db.analyses.createIndex({ userId: 1, createdAt: -1 });
db.analyses.createIndex({ analysisType: 1 });
db.analyses.createIndex({ processedOnMobile: 1 });

print("Demo veritabanı başarıyla oluşturuldu!");
print(`Toplam kullanıcı sayısı: ${db.users.countDocuments()}`);
print(`Toplam parazit türü sayısı: ${db.parasites.countDocuments()}`);
print(`Toplam rakam sayısı: ${db.digits.countDocuments()}`);
print(`Toplam analiz sayısı: ${db.analyses.countDocuments()}`);

// Kullanım notları
print("\n===== KULLANIM NOTLARI =====");
print("Demo veritabanını kullanmak için aşağıdaki bilgileri kullanabilirsiniz:");
print("Admin kullanıcısı: admin@example.com / Admin123!");
print("Normal kullanıcı: user@example.com / Test123!");
print("Veteriner kullanıcı: vet@example.com / Vet123!");
print("Şifrelerin hepsi bcrypt ile hashlenmiştir, doğrudan login için kullanılabilir."); 