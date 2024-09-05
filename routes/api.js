const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');
const documentController = require('../controllers/documentsController');
const categoryController = require('../controllers/categoriesController');

router.post('/upload', upload.single('file'), documentController.createDokuman);
router.get('/dokuman/:id', documentController.getDokuman);
router.put('/dokuman/:id', upload.single('file'), documentController.updateDokuman);

router.post('/kategori', categoryController.createKategori);
router.get('/kategori/:id', categoryController.getKategori);
router.put('/kategori/:id', categoryController.updateKategori);

module.exports = router;
