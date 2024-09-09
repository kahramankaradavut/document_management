const pool = require('../db/db');

// Doküman oluşturma
const createDokuman = async (req, res) => {
  const {
    adi,
    aciklama,
    konusu,
    departman_id,
    gecerlilik_tarihi,
    is_active,
    revizyon,
    kategori_id,
    subtitle_id,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Dosya yüklenmedi' });
  }
  
  const { mimetype, size, filename } = req.file;

  const fileUrl = `/uploads/${filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO dokuman (adi, aciklama, konusu, departman_id, subtitle_id, gecerlilik_tarihi, is_active, revizyon, kategori_id, file_type, file_size, url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        adi,
        aciklama,
        konusu,
        departman_id,
        subtitle_id,
        gecerlilik_tarihi,
        is_active,
        revizyon,
        kategori_id,
        mimetype,
        size,
        fileUrl,
      ]
    );
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman getirme
const getDokuman = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM dokuman WHERE id = $1 AND is_deleted = false',
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Doküman bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman güncelleme
const updateDokuman = async (req, res) => {
  const { id } = req.params;
  const {
    adi,
    aciklama,
    konusu,
    departman_id,
    subtitle_id,
    gecerlilik_tarihi,
    is_active,
    revizyon,
    kategori_id,
  } = req.body;
  const { mimetype, size, filename } = req.file || {};

  const fileUrl = filename ? `/uploads/${filename}` : null;

  try {
    const result = await pool.query(
      `UPDATE dokuman
       SET adi = $1, aciklama = $2, konusu = $3, departman_id = $4, subtitle_id = $5,
           gecerlilik_tarihi = $6, is_active = $7, revizyon = $8, kategori_id = $9,
           file_type = COALESCE($10, file_type), file_size = COALESCE($11, file_size), url = COALESCE($12, url)
       WHERE id = $13 RETURNING *`,
      [
        adi,
        aciklama,
        konusu,
        departman_id,
        subtitle_id,
        gecerlilik_tarihi,
        is_active,
        revizyon,
        kategori_id,
        mimetype,
        size,
        fileUrl,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman silme (soft delete)
const deleteDokuman = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE dokuman SET is_deleted = true WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Doküman silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createDokuman,
  getDokuman,
  updateDokuman,
  deleteDokuman,
};
