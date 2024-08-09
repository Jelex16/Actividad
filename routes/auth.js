const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

// Endpoint para registro
// Register user route
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const pool = await poolPromise;

    // Verificar si el email ya está registrado
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM USERS WHERE email = @email');

    if (checkUser.recordset.length > 0) {
      // Email ya registrado
      return res.status(400).json({ isSuccess: false, error: 'Email already exists' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO USERS (nombre, email, password) VALUES (@nombre, @email, @password)');

    res.status(201).json({ isSuccess: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ isSuccess: false, error: 'Internal Server Error' });
  }
});


// Endpoint para inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).send('Usuario no encontrado');
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).send('Error iniciando sesión');
    console.error(err);
  }
});

module.exports = router;
