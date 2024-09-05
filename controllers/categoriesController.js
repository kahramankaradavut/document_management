const pool = require('../db/db');

// Create Category
const createKategori = async (req, res) => {
  const { adi } = req.body;

  try {
    const existingCategory = await pool.query(
      "SELECT id FROM kategoriler WHERE adi = $1 AND is_deleted = false",
      [adi]
    );

    if (existingCategory.rows.length > 0) {
      res.status(400).json({ error: "Category already exists" });
    } else {
      const result = await pool.query(
        `INSERT INTO kategoriler (adi)
               VALUES ($1) RETURNING id`,
        [adi]
      );

      const newCategoryId = result.rows[0].id;
      res.status(200).json({ id: newCategoryId });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Category
const getKategori = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, adi, is_deleted
           FROM kategoriler
           WHERE id = $1`,
      [id]
    );

    if (result.rows.length > 0) {
      const kategori = result.rows[0];
      if (kategori.is_deleted) {
        res.json({ message: "Silinmiş Kategori", kategori });
      } else {
        res.status(200).json(kategori);
      }
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Category
const updateKategori = async (req, res) => {
  const { id } = req.params;
  const { adi, is_deleted } = req.body;

  try {
    const existingKategori = await pool.query(
      `SELECT id, adi, is_deleted
           FROM kategoriler
           WHERE id = $1`,
      [id]
    );

    if (existingKategori.rows.length > 0) {
      const kategori = existingKategori.rows[0];
      if (kategori.is_deleted) {
        res.json({ message: "Silinmiş kategori", kategori });
      } else {
        const result = await pool.query(
          `UPDATE kategoriler
                   SET adi = $1, is_deleted = $2
                   WHERE id = $3
                   RETURNING id, adi, is_deleted`,
          [adi, is_deleted, id]
        );

        res.status(200).json(result.rows[0]);
      }
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createKategori,
  getKategori,
  updateKategori,
};
