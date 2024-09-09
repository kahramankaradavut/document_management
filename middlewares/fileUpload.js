const multer = require('multer');
const path = require('path');

// Dosyaların kaydedileceği klasörün ve dosya isimlerinin belirlenmesi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Dosyaların yükleneceği dizin
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;  // Benzersiz dosya adı oluşturma
    cb(null, uniqueName);
  },
});

// Dosya boyutu sınırlandırması ve dosya yükleme ayarları
const upload = multer({
  storage,
  limits: { fileSize: 10000000 },  // Maksimum 10MB dosya boyutu
});

module.exports = upload;
