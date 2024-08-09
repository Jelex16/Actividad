// routes/publicaciones.js
const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// Obtener todas las publicaciones con sus comentarios
router.get('/publicaciones', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        p.id AS publicacionId, p.contenido AS publicacionContenido, p.fecha AS publicacionFecha, 
        u.nombre AS autorNombre,
        c.id AS comentarioId, c.contenido AS comentarioContenido, c.fecha AS comentarioFecha, cu.nombre AS comentarioAutorNombre
      FROM Publicaciones p
      JOIN Users u ON p.autor = u.id
      LEFT JOIN Comentarios c ON p.id = c.publicacion
      LEFT JOIN Users cu ON c.autor = cu.id
      ORDER BY p.fecha DESC, c.fecha ASC;
    `);

    const publicaciones = {};

    result.recordset.forEach(row => {
      if (!publicaciones[row.publicacionId]) {
        publicaciones[row.publicacionId] = {
          id: row.publicacionId,
          contenido: row.publicacionContenido,
          fecha: row.publicacionFecha,
          autor: row.autorNombre,
          comentarios: [],
        };
      }
      if (row.comentarioId) {
        publicaciones[row.publicacionId].comentarios.push({
          id: row.comentarioId,
          contenido: row.comentarioContenido,
          fecha: row.comentarioFecha,
          autor: row.comentarioAutorNombre,
        });
      }
    });

    res.json(Object.values(publicaciones));
  } catch (err) {
    res.status(500).send('Error obteniendo las publicaciones');
    console.error(err);
  }
});



router.get('/mispublicaciones/:id', async (req, res) => {
  const autorId = parseInt(req.params.id); // Obtener el ID del autor desde los parámetros de la ruta

  try {
    const pool = await poolPromise;
    const result = await pool.request().input('autorId', sql.Int, autorId).query(`
      SELECT 
        p.id AS publicacionId, p.contenido AS publicacionContenido, p.fecha AS publicacionFecha, 
        u.nombre AS autorNombre,
        c.id AS comentarioId, c.contenido AS comentarioContenido, c.fecha AS comentarioFecha, cu.nombre AS comentarioAutorNombre
      FROM Publicaciones p
      JOIN Users u ON p.autor = u.id
      LEFT JOIN Comentarios c ON p.id = c.publicacion
      LEFT JOIN Users cu ON c.autor = cu.id
      WHERE u.id = @autorId
      ORDER BY p.fecha DESC, c.fecha ASC;
    `);

    const publicaciones = {};

    result.recordset.forEach(row => {
      if (!publicaciones[row.publicacionId]) {
        publicaciones[row.publicacionId] = {
          id: row.publicacionId,
          contenido: row.publicacionContenido,
          fecha: row.publicacionFecha,
          autor: row.autorNombre,
          comentarios: [],
        };
      }
      if (row.comentarioId) {
        publicaciones[row.publicacionId].comentarios.push({
          id: row.comentarioId,
          contenido: row.comentarioContenido,
          fecha: row.comentarioFecha,
          autor: row.comentarioAutorNombre,
        });
      }
    });

    res.json(Object.values(publicaciones));
  } catch (err) {
    res.status(500).send('Error obteniendo las publicaciones');
    console.error(err);
  }
});



// Obtener una publicación por ID
router.get('/publicaciones/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          p.id AS publicacionId, p.contenido AS publicacionContenido, p.fecha AS publicacionFecha, 
          u.nombre AS autorNombre,
          c.id AS comentarioId, c.contenido AS comentarioContenido, c.fecha AS comentarioFecha, cu.nombre AS comentarioAutorNombre
        FROM Publicaciones p
        JOIN Users u ON p.autor = u.id
        LEFT JOIN Comentarios c ON p.id = c.publicacion
        LEFT JOIN Users cu ON c.autor = cu.id
        WHERE p.id = @id
        ORDER BY c.fecha ASC;
      `);

    if (!result.recordset.length) {
      return res.status(404).send('Publicación no encontrada');
    }

    const publicacion = {
      id: result.recordset[0].publicacionId,
      contenido: result.recordset[0].publicacionContenido,
      fecha: result.recordset[0].publicacionFecha,
      autor: result.recordset[0].autorNombre,
      comentarios: [],
    };

    result.recordset.forEach(row => {
      if (row.comentarioId) {
        publicacion.comentarios.push({
          id: row.comentarioId,
          contenido: row.comentarioContenido,
          fecha: row.comentarioFecha,
          autor: row.comentarioAutorNombre,
        });
      }
    });

    res.json(publicacion);
  } catch (err) {
    res.status(500).send('Error obteniendo la publicación');
    console.error(err);
  }
});

// Crear una nueva publicación
router.post('/publicaciones', async (req, res) => {
  try {
    const { autor, contenido } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('autor', sql.Int, autor)
      .input('contenido', sql.Text, contenido)
      .input('fecha', sql.DateTime, new Date())
      .query(`
        INSERT INTO Publicaciones (autor, fecha, contenido)
        VALUES (@autor, @fecha, @contenido);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    res.status(500).send('Error creando la publicación');
    console.error(err);
  }
});

// Crear un nuevo comentario en una publicación
router.post('/publicaciones/:id/comentarios', async (req, res) => {
  try {
    const { autor, contenido } = req.body;
    const publicacionId = req.params.id;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('publicacion', sql.Int, publicacionId)
      .input('autor', sql.Int, autor)
      .input('contenido', sql.Text, contenido)
      .input('fecha', sql.DateTime, new Date())
      .query(`
        INSERT INTO Comentarios (publicacion, autor, fecha, contenido)
        VALUES (@publicacion, @autor, @fecha, @contenido);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    res.status(500).send('Error creando el comentario');
    console.error(err);
  }
});

module.exports = router;
