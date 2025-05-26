const User = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * Tüm kullanıcıları listele (Admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Sayfa ve limit validasyonu
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Filtreleme koşulları
    const filter = {};
    
    if (role && ['user', 'veterinarian', 'admin'].includes(role)) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sıralama
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Toplam kullanıcı sayısı
    const totalCount = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Kullanıcıları getir
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      },
      filters: {
        role: role || null,
        search: search || null,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcı detayı getir (Admin)
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı ID formatı'
      });
    }
    next(error);
  }
};

/**
 * Yeni kullanıcı oluştur (Admin)
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'İsim, e-posta ve şifre gereklidir'
      });
    }

    // E-posta kontrolü
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Şifre validasyonu
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    // Rol validasyonu
    if (!['user', 'veterinarian', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz rol'
      });
    }

    // Kullanıcı oluştur
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role
    });

    // Şifreyi yanıttan çıkar
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: userResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }
    next(error);
  }
};

/**
 * Kullanıcı güncelle (Admin)
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Güncellenecek alanları hazırla
    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (email) {
      // E-posta değişikliği kontrolü
      if (email.toLowerCase() !== user.email) {
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: id }
        });
        
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor'
          });
        }
      }
      updateData.email = email.toLowerCase().trim();
    }

    if (role && ['user', 'veterinarian', 'admin'].includes(role)) {
      updateData.role = role;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Şifre en az 6 karakter olmalıdır'
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    updateData.updatedAt = new Date();

    // Kullanıcıyı güncelle
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı ID formatı'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }
    next(error);
  }
};

/**
 * Kullanıcı sil (Admin)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kendi hesabını silmeye çalışıyor mu kontrol et
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Kendi hesabınızı silemezsiniz'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı ID formatı'
      });
    }
    next(error);
  }
};

/**
 * Kullanıcı istatistikleri (Admin Dashboard)
 */
exports.getUserStats = async (req, res, next) => {
  try {
    // Toplam kullanıcı sayısı
    const totalUsers = await User.countDocuments();

    // Role göre dağılım
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Son 30 günde kayıt olan kullanıcılar
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Aylık kayıt istatistikleri (son 12 ay)
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        recentUsers,
        roleDistribution: roleStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        monthlyRegistrations: monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
}; 