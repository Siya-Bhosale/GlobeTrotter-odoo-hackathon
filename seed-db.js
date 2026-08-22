/**
 * Standalone MySQL Seeder and Database Initializer for GlobeTrotter
 * Usage: node scripts/seed-db.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const host = process.env.DATABASE_HOST || process.env.MYSQL_HOST || 'localhost';
  const user = process.env.DATABASE_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DATABASE_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const port = Number(process.env.DATABASE_PORT || process.env.MYSQL_PORT || 3306);

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('Connected! Executing schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');
    await connection.query(schemaSql);
    console.log('schema.sql executed successfully.');

    console.log('Executing seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf-8');
    await connection.query(seedSql);
    console.log('seed.sql executed successfully.');

    console.log('Database initialization and seeding completed successfully!');
  } catch (err) {
    console.error('Error executing database setup:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

main();
