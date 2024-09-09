const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload'); 

const categoriesController = require('../controllers/categoriesController');
const documentsController = require('../controllers/documentsController');
const subtitlesController = require('../controllers/subtitlesController');
const dokumanKategoriController = require('../controllers/dokumanKategoriController');
const dokumanBirimController = require('../controllers/dokumanBirimController');
const revizyonController = require('../controllers/revizyonController');

// Kategori Rotaları
router.post('/kategori', categoriesController.createKategori);
router.get('/kategori/:id', categoriesController.getKategori);
router.put('/kategori/:id', categoriesController.updateKategori);
router.delete('/kategori/:id', categoriesController.deleteKategori);

// Doküman Rotaları
router.post('/dokuman', upload.single('file'), documentsController.createDokuman);
router.get('/dokuman/:id', documentsController.getDokuman);
router.put('/dokuman/:id', documentsController.updateDokuman);
router.delete('/dokuman/:id', documentsController.deleteDokuman);

// Alt Birim (Subtitle) Rotaları
router.post('/subtitle', subtitlesController.createSubtitle);
router.get('/subtitle/:id', subtitlesController.getSubtitle);
router.put('/subtitle/:id', subtitlesController.updateSubtitle);
router.delete('/subtitle/:id', subtitlesController.deleteSubtitle);

// Doküman Kategori Rotaları
router.post('/dokuman_kategori', dokumanKategoriController.createDokumanKategori);
router.get('/dokuman_kategori/:id', dokumanKategoriController.getDokumanKategori);
router.put('/dokuman_kategori/:id', dokumanKategoriController.updateDokumanKategori);
router.delete('/dokuman_kategori/:id', dokumanKategoriController.deleteDokumanKategori);

// Doküman Birim Rotaları
router.post('/dokuman_birim', dokumanBirimController.createDokumanBirim);
router.get('/dokuman_birim/:id', dokumanBirimController.getDokumanBirim);
router.put('/dokuman_birim/:id', dokumanBirimController.updateDokumanBirim);
router.delete('/dokuman_birim/:id', dokumanBirimController.deleteDokumanBirim);

// Revizyon Rotaları
router.post('/revizyon', revizyonController.createRevizyon);
router.get('/revizyon/:id', revizyonController.getRevizyon);
router.put('/revizyon/:id', revizyonController.updateRevizyon);
router.delete('/revizyon/:id', revizyonController.deleteRevizyon);

module.exports = router;
