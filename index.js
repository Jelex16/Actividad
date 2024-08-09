const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const publicacionesRoutes = require('./routes/publicaciones');
const auth = require('./routes/auth');
const path = require('path');
// const { connectToDatabase } = require('./public/js/connection/db');
// const routes = require('./public/js/connection/routes');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());

// const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    return res.status(403).send('Access to .html files is forbidden.');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos HTML desde el directorio 'views'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'index.html'));
});

app.get('/indicadores', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'indicadores.html'));
});

app.get('/prevenciones', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'prevenciones.html'));
});

app.get('/escolar', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'escolar.html'));
});

app.get('/testimonios', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'testimonios.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views', 'login.html'));
});
app.use('/api', publicacionesRoutes);
app.use('/api', auth);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));
app.use(cors());


// connectToDatabase().then(() => {
//   app.use('/api', routes);

// }).catch(err => {
//   console.error('No se pudo conectar a la base de datos, cerrando la aplicación');
//   process.exit(1);
// });

app.listen(port, () => {
  console.log(`Está ejecutándose en http://localhost:${port}`);
});