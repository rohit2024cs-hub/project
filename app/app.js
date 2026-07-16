require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// 1. Apache Doris Connection (We will use this for EVERYTHING now)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error('Apache Doris connection failed:', err);
  else console.log('Connected to Apache Doris via MySQL Protocol');
});

// Endpoint 1: Get products native to Doris
app.get('/products', (req, res) => {
  db.query('SELECT * FROM product', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Endpoint 2: Get products from ClickHouse via Doris Catalog
// This replaces your old /ch-products endpoint
app.get('/ch-products', (req, res) => {
  // We query the catalog directly here
  const sql = 'SELECT * FROM clickhouse_cluster.shop_db.product';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Doris-ClickHouse query error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
