const pool = require('../db/db');

// Alt birim (Subtitle) oluşturma
const createSubtitle = async (req, res) => {
  const { adi, departman_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO subtitle (adi, departman_id) VALUES ($1, $2) RETURNING id',
      [adi, departman_id]
    );
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Alt birim (Subtitle) getirme
const getSubtitle = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM subtitle WHERE id = $1',
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Alt birim bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Alt birim (Subtitle) güncelleme
const updateSubtitle = async (req, res) => {
  const { id } = req.params;
  const { adi, departman_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE subtitle SET adi = $1, departman_id = $2 WHERE id = $3 RETURNING *',
      [adi, departman_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Alt birim (Subtitle) silme (soft delete)
const deleteSubtitle = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE subtitle SET is_deleted = true WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Alt birim silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createSubtitle,
  getSubtitle,
  updateSubtitle,
  deleteSubtitle,
};
