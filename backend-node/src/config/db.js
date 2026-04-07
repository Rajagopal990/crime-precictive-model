const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.RBAC_DB_HOST || '127.0.0.1',
  port: Number(process.env.RBAC_DB_PORT || 3306),
  user: process.env.RBAC_DB_USER || 'root',
  password: process.env.RBAC_DB_PASSWORD || '',
  database: process.env.RBAC_DB_NAME || 'crime_rbac',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
