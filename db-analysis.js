// OpCa Veritabanı Analiz Komutları
// Bu dosyayı mongosh ile çalıştırın: mongosh "mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca" db-analysis.js

print("=== OpCa Veritabanı Analiz Raporu ===\n");

// 1. Tüm koleksiyonları listele
print("1. Mevcut Koleksiyonlar:");
print("------------------------");
db.runCommand("listCollections").cursor.firstBatch.forEach(function(collection) {
    print("- " + collection.name);
});
print("");

// 2. Her koleksiyondaki kayıt sayıları
print("2. Koleksiyon Kayıt Sayıları:");
print("-----------------------------");
const collections = ["users", "analyses", "parasites", "digits", "mobilemodels"];
collections.forEach(function(collName) {
    try {
        const count = db[collName].countDocuments();
        print(collName + ": " + count + " kayıt");
    } catch(e) {
        print(collName + ": Koleksiyon bulunamadı");
    }
});
print("");

// 3. Users koleksiyonu analizi
print("3. Users Koleksiyonu:");
print("--------------------");
try {
    const userCount = db.users.countDocuments();
    print("Toplam kullanıcı: " + userCount);
    
    if (userCount > 0) {
        print("\nKullanıcı rolleri:");
        db.users.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]).forEach(function(doc) {
            print("- " + doc._id + ": " + doc.count);
        });
        
        print("\nAdmin kullanıcı:");
        const admin = db.users.findOne({ email: "admin@example.com" });
        if (admin) {
            print("- ID: " + admin._id);
            print("- Name: " + admin.name);
            print("- Email: " + admin.email);
            print("- Role: " + admin.role);
        } else {
            print("Admin kullanıcı bulunamadı!");
        }
    }
} catch(e) {
    print("Users koleksiyonu hatası: " + e.message);
}
print("");

// 4. Analyses koleksiyonu analizi
print("4. Analyses Koleksiyonu:");
print("-----------------------");
try {
    const analysisCount = db.analyses.countDocuments();
    print("Toplam analiz: " + analysisCount);
    
    if (analysisCount > 0) {
        print("\nAnaliz tipleri:");
        db.analyses.aggregate([
            { $group: { _id: "$analysisType", count: { $sum: 1 } } }
        ]).forEach(function(doc) {
            print("- " + doc._id + ": " + doc.count);
        });
        
        print("\nProcessedOnMobile durumu:");
        db.analyses.aggregate([
            { $group: { _id: "$processedOnMobile", count: { $sum: 1 } } }
        ]).forEach(function(doc) {
            print("- " + doc._id + ": " + doc.count);
        });
        
        print("\nKullanıcı bazında analiz sayıları:");
        db.analyses.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            { $limit: 5 }
        ]).forEach(function(doc) {
            print("- UserID " + doc._id + ": " + doc.count + " analiz");
        });
        
        print("\nÖrnek analiz kaydı:");
        const sampleAnalysis = db.analyses.findOne();
        if (sampleAnalysis) {
            print("- ID: " + sampleAnalysis._id);
            print("- UserID: " + sampleAnalysis.userId);
            print("- Type: " + sampleAnalysis.analysisType);
            print("- ProcessedOnMobile: " + sampleAnalysis.processedOnMobile);
            print("- CreatedAt: " + sampleAnalysis.createdAt);
            if (sampleAnalysis.parasiteResults) {
                print("- ParasiteResults: " + sampleAnalysis.parasiteResults.length + " sonuç");
            }
            if (sampleAnalysis.digitResults) {
                print("- DigitResults: " + sampleAnalysis.digitResults.length + " sonuç");
            }
        }
        
        // Admin kullanıcısının analizleri
        const admin = db.users.findOne({ email: "admin@example.com" });
        if (admin) {
            print("\nAdmin kullanıcısının analizleri:");
            const adminAnalyses = db.analyses.countDocuments({ userId: admin._id });
            print("- Toplam: " + adminAnalyses);
            
            const adminAnalysesWithMobile = db.analyses.countDocuments({ 
                userId: admin._id, 
                processedOnMobile: false 
            });
            print("- ProcessedOnMobile=false: " + adminAnalysesWithMobile);
            
            const adminAnalysesWithMobileTrue = db.analyses.countDocuments({ 
                userId: admin._id, 
                processedOnMobile: true 
            });
            print("- ProcessedOnMobile=true: " + adminAnalysesWithMobileTrue);
        }
    }
} catch(e) {
    print("Analyses koleksiyonu hatası: " + e.message);
}
print("");

// 5. Parasites koleksiyonu analizi
print("5. Parasites Koleksiyonu:");
print("------------------------");
try {
    const parasiteCount = db.parasites.countDocuments();
    print("Toplam parazit: " + parasiteCount);
    
    if (parasiteCount > 0) {
        print("\nParazit tipleri:");
        db.parasites.find({}, { type: 1, name: 1 }).forEach(function(doc) {
            print("- " + doc.type + " (" + doc.name + ")");
        });
    }
} catch(e) {
    print("Parasites koleksiyonu hatası: " + e.message);
}
print("");

// 6. Digits koleksiyonu analizi
print("6. Digits Koleksiyonu:");
print("---------------------");
try {
    const digitCount = db.digits.countDocuments();
    print("Toplam rakam: " + digitCount);
    
    if (digitCount > 0) {
        print("\nRakam değerleri:");
        db.digits.find({}, { value: 1 }).sort({ value: 1 }).forEach(function(doc) {
            print("- " + doc.value);
        });
    }
} catch(e) {
    print("Digits koleksiyonu hatası: " + e.message);
}
print("");

// 7. Index analizi
print("7. Index Bilgileri:");
print("------------------");
collections.forEach(function(collName) {
    try {
        print("\n" + collName + " indexes:");
        db[collName].getIndexes().forEach(function(index) {
            print("- " + JSON.stringify(index.key));
        });
    } catch(e) {
        print(collName + ": Index bilgisi alınamadı");
    }
});
print("");

print("=== Analiz Tamamlandı ==="); 