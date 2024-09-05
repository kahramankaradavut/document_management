const pool = require('../db/db');

// Create Document
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
    sebep,
    subtitle_id,
  } = req.body;
  const { mimetype, size, filename } = req.file;

  const fileUrl = `/uploads/${filename}`;

  try {
    const existingDoc = await pool.query(
      "SELECT id FROM dokuman WHERE adi = $1 AND is_deleted = false",
      [adi]
    );

    let newDocId;
    let previousDocId = null;

    if (existingDoc.rows.length > 0) {
      previousDocId = existingDoc.rows[existingDoc.rows.length - 1].id;
    }

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

    newDocId = result.rows[0].id;

    // Dokuman kategorisini ekle
    await pool.query(
      `INSERT INTO dokuman_kategori (dokuman_id, kategori_id)
           VALUES ($1, $2)`,
      [newDocId, kategori_id]
    );

    // Dokuman birimini ekle
    await pool.query(
      `INSERT INTO dokuman_birim (dokuman_id, departman_id)
         VALUES ($1, $2)`,
      [newDocId, departman_id]
    );

    if (previousDocId) {
      const previousContent = await pool.query(
        "SELECT * FROM dokuman WHERE id = $1",
        [previousDocId]
      );

      const eskiIcerikJson = {
        adi: previousDocData.rows[0].adi,
        aciklama: previousDocData.rows[0].aciklama,
        konusu: previousDocData.rows[0].konusu,
        departman_id: previousDocData.rows[0].departman_id,
        subtitle_id: previousDocData.rows[0].subtitle_id,
        gecerlilik_tarihi: previousDocData.rows[0].gecerlilik_tarihi,
        is_active: previousDocData.rows[0].is_active,
        revizyon: previousDocData.rows[0].revizyon,
        kategori_id: previousDocData.rows[0].kategori_id,
        file_type: previousDocData.rows[0].file_type,
        file_size: previousDocData.rows[0].file_size,
        url: previousDocData.rows[0].url,
        created_at: previousDocData.rows[0].created_at,
        updated_at: previousDocData.rows[0].updated_at,
      };

      const revisionResult = await pool.query(
        `INSERT INTO revizyon (sebep, onceki_dokuman, eski_icerik, dokuman_id)
               VALUES ($1, $2, $3, $4) RETURNING id`,
        [sebep, previousDocId, eskiIcerik, newDocId]
      );

      const newRevisionId = revisionResult.rows[0].id;

      await pool.query(`UPDATE dokuman SET revizyon = $1 WHERE id = $2`, [
        newRevisionId,
        newDocId,
      ]);
    }

    res.status(200).json({ id: newDocId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Document
const getDokuman = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, adi, aciklama, konusu, departman_id, subtitle_id, gecerlilik_tarihi, is_active, revizyon, kategori_id, file_type, file_size, url, is_deleted
           FROM dokuman
           WHERE id = $1`,
      [id]
    );

    if (result.rows.length > 0) {
      const document = result.rows[0];
      if (document.is_deleted) {
        res.json({ message: "Silinmiş Dokuman", document });
      } else {
        res.status(200).json(document);
      }
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Document
const updateDokuman = async (req, res) => {
  const { id } = req.params;
  const {
    adi,
    aciklama,
    konusu,
    departman_id,
    gecerlilik_tarihi,
    is_active,
    revizyon,
    kategori_id,
    is_deleted,
    subtitle_id,
  } = req.body;
  const { mimetype, size, filename } = req.file || {};

  const fileUrl = filename ? `/uploads/${filename}` : null;

  try {
    const existingDoc = await pool.query(
      `SELECT id, adi, aciklama, konusu, departman_id, subtitle_id, gecerlilik_tarihi, is_active, revizyon, kategori_id, file_type, file_size, url, is_deleted
           FROM dokuman
           WHERE id = $1`,
      [id]
    );

    if (existingDoc.rows.length > 0) {
      const dokuman = existingDoc.rows[0];
      if (dokuman.is_deleted) {
        res.json({ message: "Document is deleted", dokuman });
      } else {
        const result = await pool.query(
          `UPDATE dokuman
                   SET adi = $1, aciklama = $2, konusu = $3, departman_id = $4, subtitle_id = $5, gecerlilik_tarihi = $6, is_active = $7, revizyon = $8, kategori_id = $9, is_deleted = $10, file_type = $11, file_size = $12, url = $13
                   WHERE id = $14
                   RETURNING id, adi, aciklama, konusu, departman_id, subtitle_id, gecerlilik_tarihi, is_active, revizyon, kategori_id, is_deleted, file_type, file_size, url`,
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
            is_deleted,
            mimetype || dokuman.file_type,
            size || dokuman.file_size,
            fileUrl || dokuman.url,
            id,
          ]
        );

        if (kategori_id) {
          await pool.query(
            `UPDATE dokuman_kategori
                       SET kategori_id = $1
                       WHERE dokuman_id = $2`,
            [kategori_id, id]
          );
        }

        if (departman_id) {
          await pool.query(
            `UPDATE dokuman_birim
                       SET departman_id = $1
                       WHERE dokuman_id = $2`,
            [departman_id, id]
          );
        }

        res.status(200).json(result.rows[0]);
      }
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createDokuman,
  getDokuman,
  updateDokuman,
};
