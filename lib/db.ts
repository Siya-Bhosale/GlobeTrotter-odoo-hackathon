import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let isConnected: boolean = false;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.DATABASE_HOST || process.env.MYSQL_HOST;
  const user = process.env.DATABASE_USER || process.env.MYSQL_USER;
  const password = process.env.DATABASE_PASSWORD || process.env.MYSQL_PASSWORD;
  const database = process.env.DATABASE_NAME || process.env.MYSQL_DATABASE || 'globetrotter';
  const port = Number(process.env.DATABASE_PORT || process.env.MYSQL_PORT || 3306);

  if (host && user) {
    try {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });
      isConnected = true;
      console.log(`[GlobeTrotter DB] Connected to MySQL 8.0+ at ${host}:${port}/${database}`);
    } catch (err) {
      console.warn('[GlobeTrotter DB] MySQL connection failed, falling back to local store:', err);
      pool = null;
      isConnected = false;
    }
  }

  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDbPool();
  if (!db) {
    throw new Error('MySQL connection pool not available');
  }

  const [rows] = await db.query(sql, params);
  return rows as T[];
}

export function isMySQLEnabled(): boolean {
  return !!(process.env.DATABASE_HOST || process.env.MYSQL_HOST);
}
