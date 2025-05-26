const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect('mongodb+srv://Cluster53739:1910@cluster53739.lsf3k.mongodb.net/opca');
    console.log('MongoDB bağlantısı başarılı');
    
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('Admin1234!', 12);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin kullanıcısı oluşturuldu:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin1234!');
    console.log('   Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

createAdmin(); 