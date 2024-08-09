// config/db.js
const sql = require('mssql');

const dbConfig = {
  user: 'admin', // Reemplaza con tu usuario de la base de datos
  password: 'PerroMiado', // Reemplaza con tu contraseña de la base de datos
  server: 'database-1.cxwyo2mmqyak.us-east-2.rds.amazonaws.com', // Servidor de la base de datos
  database: 'VCM', // Reemplaza con el nombre de tu base de datos
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true, 
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Conectado a la base de datos SQL Server');
    return pool;
  })
  .catch(err => console.log('Error en la conexión a la base de datos:', err));

module.exports = {
  sql, poolPromise
};
