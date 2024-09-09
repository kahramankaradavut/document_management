const pool = require('../db/db');

// Revizyon oluşturma
const createRevizyon = async (req, res) => {
  const { sebep, onceki_dokuman, eski_icerik, dokuman_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO revizyon (sebep, onceki_dokuman, eski_icerik, dokuman_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [sebep, onceki_dokuman, eski_icerik, dokuman_id]
    );
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Revizyon getirme
const getRevizyon = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM revizyon WHERE id = $1',
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Revizyon bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Revizyon güncelleme
const updateRevizyon = async (req, res) => {
  const { id } = req.params;
  const { sebep, onceki_dokuman, eski_icerik, dokuman_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE revizyon SET sebep = $1, onceki_dokuman = $2, eski_icerik = $3, dokuman_id = $4 WHERE id = $5 RETURNING *',
      [sebep, onceki_dokuman, eski_icerik, dokuman_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Revizyon silme (soft delete)
const deleteRevizyon = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM revizyon WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Revizyon silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createRevizyon,
  getRevizyon,
  updateRevizyon,
  deleteRevizyon,
};
