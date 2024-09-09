const pool = require('../db/db');

// Doküman-Birim ilişkilendirme
const createDokumanBirim = async (req, res) => {
  const { dokuman_id, departman_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dokuman_birim (dokuman_id, departman_id) VALUES ($1, $2) RETURNING id',
      [dokuman_id, departman_id]
    );
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Birim ilişkisini getirme
const getDokumanBirim = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM dokuman_birim WHERE id = $1',
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Doküman-Birim ilişkisi bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Birim ilişkilendirmeyi güncelleme
const updateDokumanBirim = async (req, res) => {
  const { id } = req.params;
  const { dokuman_id, departman_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE dokuman_birim SET dokuman_id = $1, departman_id = $2 WHERE id = $3 RETURNING *',
      [dokuman_id, departman_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Doküman-Birim ilişkilendirmeyi silme (soft delete)
const deleteDokumanBirim = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM dokuman_birim WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Doküman-Birim ilişkisi silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createDokumanBirim,
  getDokumanBirim,
  updateDokumanBirim,
  deleteDokumanBirim,
};
