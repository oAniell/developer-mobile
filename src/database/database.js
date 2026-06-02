import { Platform } from 'react-native';
import { storage } from './storage';

let sqliteDb = null;

async function initSQLite() {
  const SQLite = require('expo-sqlite');
  sqliteDb = await SQLite.openDatabaseAsync('pedidos.db');
  await sqliteDb.execAsync(
    `CREATE TABLE IF NOT EXISTS pedidos_pendentes (
      id TEXT PRIMARY KEY NOT NULL, produto TEXT NOT NULL,
      quantidade INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'PENDENTE',
      erro_msg TEXT, created_at INTEGER NOT NULL
    );`
  );
  await sqliteDb.execAsync(
    `CREATE TABLE IF NOT EXISTS produtos_cache (
      id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, descricao TEXT
    );`
  );
}

export async function initDatabase() {
  if (Platform.OS === 'web') {
    await storage.init();
  } else {
    await initSQLite();
  }
}

export function getDatabase() {
  return sqliteDb;
}

export function isWeb() {
  return Platform.OS === 'web';
}
