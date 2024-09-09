const pool = require('../db/db');

// Doküman-Kategori ilişkilendirme
const createDokumanKategori = async (req, res) => {
  const { dokuman_id, kategori_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dokuman_kategori (dokuman_id, kategori_id) VALUES ($1, $2) RETURNING id',
      [dokuman_id, kategori_id]
    );
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Kategori ilişkisini getirme
const getDokumanKategori = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM dokuman_kategori WHERE id = $1',
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Doküman-Kategori ilişkisi bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Kategori ilişkilendirmeyi güncelleme
const updateDokumanKategori = async (req, res) => {
  const { id } = req.params;
  const { dokuman_id, kategori_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE dokuman_kategori SET dokuman_id = $1, kategori_id = $2 WHERE id = $3 RETURNING *',
      [dokuman_id, kategori_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Kategori ilişkilendirmeyi silme (soft delete)
const deleteDokumanKategori = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM dokuman_kategori WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Doküman-Kategori ilişkisi silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createDokumanKategori,
  getDokumanKategori,
  updateDokumanKategori,
  deleteDokumanKategori,
};
