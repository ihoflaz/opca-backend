// OpCa Demo Veri Oluşturma Scripti
// Kullanım: mongosh "mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca" --file create-demo-data.js

print("=== OpCa Demo Veri Oluşturma Başlıyor ===\n");

// Mevcut verileri temizle (isteğe bağlı)
const clearExisting = false; // true yaparsanız mevcut veriler silinir

if (clearExisting) {
    print("🗑️  Mevcut veriler temizleniyor...");
    db.users.deleteMany({});
    db.analyses.deleteMany({});
    db.parasites.deleteMany({});
    db.digits.deleteMany({});
    db.mobilemodels.deleteMany({});
    print("✅ Mevcut veriler temizlendi\n");
}

// 1. PARASITES KOLEKSIYONU
print("1. 📦 Parasites koleksiyonu doldruluyor...");

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
    db.parasites.insertMany(parasites);
    print(`✅ ${parasites.length} parazit kaydı eklendi`);
} catch (e) {
    print(`❌ Parasites hatası: ${e.message}`);
}

// 2. DIGITS KOLEKSIYONU
print("\n2. 🔢 Digits koleksiyonu doldruluyor...");

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
    db.digits.insertMany(digits);
    print(`✅ ${digits.length} rakam kaydı eklendi`);
} catch (e) {
    print(`❌ Digits hatası: ${e.message}`);
}

// 3. MOBILE MODELS KOLEKSIYONU
print("\n3. 📱 MobileModels koleksiyonu doldruluyor...");

const mobileModels = [
    {
        modelType: "parasite",
        modelName: "parasite-mobilenet-v1",
        version: "1.0.0",
        description: "Parazit tanıma için optimize edilmiş MobileNet modeli",
        fileSize: 15728640, // 15MB
        accuracy: 0.89,
        supportedClasses: ["Neosporosis", "Echinococcosis", "Coenurosis", "Toxoplasmosis", "Cryptosporidiosis"],
        downloadUrl: "https://opca-bucket.s3.amazonaws.com/models/parasite-mobilenet-v1.tflite",
        checksum: "a1b2c3d4e5f6789012345678901234567890abcd",
        isActive: true,
        releaseDate: new Date("2024-01-15"),
        minAppVersion: "1.0.0"
    },
    {
        modelType: "parasite",
        modelName: "parasite-mobilenet-v2",
        version: "1.1.0",
        description: "Geliştirilmiş parazit tanıma modeli - daha yüksek doğruluk",
        fileSize: 18874368, // 18MB
        accuracy: 0.92,
        supportedClasses: ["Neosporosis", "Echinococcosis", "Coenurosis", "Toxoplasmosis", "Cryptosporidiosis"],
        downloadUrl: "https://opca-bucket.s3.amazonaws.com/models/parasite-mobilenet-v2.tflite",
        checksum: "b2c3d4e5f6789012345678901234567890abcdef",
        isActive: true,
        releaseDate: new Date("2024-02-20"),
        minAppVersion: "1.1.0"
    },
    {
        modelType: "mnist",
        modelName: "mnist-convnet-v1",
        version: "1.0.0",
        description: "El yazısı rakam tanıma için CNN modeli",
        fileSize: 8388608, // 8MB
        accuracy: 0.98,
        supportedClasses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        downloadUrl: "https://opca-bucket.s3.amazonaws.com/models/mnist-convnet-v1.tflite",
        checksum: "c3d4e5f6789012345678901234567890abcdef12",
        isActive: true,
        releaseDate: new Date("2024-01-10"),
        minAppVersion: "1.0.0"
    },
    {
        modelType: "mnist",
        modelName: "mnist-convnet-v2",
        version: "1.1.0",
        description: "Optimize edilmiş MNIST modeli - daha hızlı işlem",
        fileSize: 6291456, // 6MB
        accuracy: 0.99,
        supportedClasses: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        downloadUrl: "https://opca-bucket.s3.amazonaws.com/models/mnist-convnet-v2.tflite",
        checksum: "d4e5f6789012345678901234567890abcdef1234",
        isActive: true,
        releaseDate: new Date("2024-03-01"),
        minAppVersion: "1.2.0"
    }
];

try {
    db.mobilemodels.insertMany(mobileModels);
    print(`✅ ${mobileModels.length} mobil model kaydı eklendi`);
} catch (e) {
    print(`❌ MobileModels hatası: ${e.message}`);
}

// 4. USERS KOLEKSIYONU
print("\n4. 👥 Users koleksiyonu doldruluyor...");

const bcrypt = require('bcrypt'); // Not: Bu mongosh'da çalışmayacak, manuel hash kullanacağız

const users = [
    // Admin kullanıcıları
    {
        name: "Admin Kullanıcı",
        email: "admin@example.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "admin"
    },
    {
        name: "Sistem Yöneticisi",
        email: "sysadmin@opca.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "admin"
    },
    
    // Veteriner hekim kullanıcıları
    {
        name: "Dr. Ahmet Yılmaz",
        email: "ahmet.yilmaz@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    {
        name: "Dr. Ayşe Demir",
        email: "ayse.demir@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    {
        name: "Dr. Mehmet Kaya",
        email: "mehmet.kaya@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    {
        name: "Dr. Fatma Özkan",
        email: "fatma.ozkan@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    {
        name: "Dr. Ali Çelik",
        email: "ali.celik@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    {
        name: "Dr. Zeynep Arslan",
        email: "zeynep.arslan@vet.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "veterinarian"
    },
    
    // Normal kullanıcılar
    {
        name: "Mustafa Koç",
        email: "mustafa.koc@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Elif Şahin",
        email: "elif.sahin@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Burak Yıldız",
        email: "burak.yildiz@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Seda Aydın",
        email: "seda.aydin@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Emre Polat",
        email: "emre.polat@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Gizem Erdoğan",
        email: "gizem.erdogan@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Oğuz Kılıç",
        email: "oguz.kilic@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Merve Güneş",
        email: "merve.gunes@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Kemal Öztürk",
        email: "kemal.ozturk@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Deniz Yılmaz",
        email: "deniz.yilmaz@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Ceren Aktaş",
        email: "ceren.aktas@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Barış Çetin",
        email: "baris.cetin@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "İrem Koçak",
        email: "irem.kocak@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    },
    {
        name: "Arda Şen",
        email: "arda.sen@gmail.com",
        password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user"
    }
];

let insertedUsers = [];
try {
    const result = db.users.insertMany(users);
    insertedUsers = result.insertedIds;
    print(`✅ ${users.length} kullanıcı kaydı eklendi`);
} catch (e) {
    print(`❌ Users hatası: ${e.message}`);
}

// 5. ANALYSES KOLEKSIYONU
print("\n5. 🔬 Analyses koleksiyonu doldruluyor...");

// Kullanıcı ID'lerini al
const allUsers = db.users.find({}).toArray();
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
    "Android 13 / Google Pixel 7",
    "Server"
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
            deviceInfo: processedOnMobile ? devices[Math.floor(Math.random() * (devices.length - 1))] : "Server",
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
            const shuffledParasites = parasiteTypes.sort(() => 0.5 - Math.random());
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
            analysis.parasiteResults = analysis.parasiteResults.map(result => ({
                ...result,
                confidence: Math.round((result.confidence / sum) * 100) / 100
            }));
            
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
            analysis.digitResults = analysis.digitResults.map(result => ({
                ...result,
                confidence: Math.round((result.confidence / sum) * 100) / 100
            }));
        }
        
        analyses.push(analysis);
    }
}

try {
    // Analizleri küçük gruplar halinde ekle (MongoDB limit nedeniyle)
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < analyses.length; i += batchSize) {
        const batch = analyses.slice(i, i + batchSize);
        db.analyses.insertMany(batch);
        totalInserted += batch.length;
        print(`   📊 ${totalInserted}/${analyses.length} analiz eklendi...`);
    }
    
    print(`✅ Toplam ${analyses.length} analiz kaydı eklendi`);
} catch (e) {
    print(`❌ Analyses hatası: ${e.message}`);
}

// 6. ÖZET RAPOR
print("\n=== 📋 ÖZET RAPOR ===");
print(`👥 Kullanıcılar: ${db.users.countDocuments()}`);
print(`🔬 Analizler: ${db.analyses.countDocuments()}`);
print(`🦠 Parazitler: ${db.parasites.countDocuments()}`);
print(`🔢 Rakamlar: ${db.digits.countDocuments()}`);
print(`📱 Mobil Modeller: ${db.mobilemodels.countDocuments()}`);

print("\n👥 Kullanıcı Rolleri:");
db.users.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
]).forEach(function(doc) {
    print(`   - ${doc._id}: ${doc.count} kullanıcı`);
});

print("\n🔬 Analiz Tipleri:");
db.analyses.aggregate([
    { $group: { _id: "$analysisType", count: { $sum: 1 } } }
]).forEach(function(doc) {
    print(`   - ${doc._id}: ${doc.count} analiz`);
});

print("\n📱 İşlem Yeri:");
db.analyses.aggregate([
    { $group: { _id: "$processedOnMobile", count: { $sum: 1 } } }
]).forEach(function(doc) {
    print(`   - ${doc._id ? 'Mobil' : 'Server'}: ${doc.count} analiz`);
});

print("\n🎉 Demo veriler başarıyla oluşturuldu!");
print("\n📝 Tüm kullanıcıların şifresi: 'password'");
print("🔑 Admin hesapları:");
print("   - admin@example.com");
print("   - sysadmin@opca.com");

print("\n=== Demo Veri Oluşturma Tamamlandı ==="); 