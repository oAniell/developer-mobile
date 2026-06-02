import { getDatabase, isWeb } from './database';
import { storage } from './storage';

export async function saveProductsCache(produtos) {
  if (isWeb()) return storage.saveProductsCache(produtos);
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM produtos_cache`);
    for (const p of produtos) {
      await db.runAsync(
        `INSERT INTO produtos_cache (id, nome, descricao) VALUES (?, ?, ?)`,
        [String(p.id), p.nome, p.descricao ?? null]
      );
    }
  });
}

export async function getProductsCache() {
  if (isWeb()) return storage.getProductsCache();
  const db = getDatabase();
  return db.getAllAsync(`SELECT * FROM produtos_cache`);
}

export async function isProductsCacheEmpty() {
  if (isWeb()) return storage.isProductsCacheEmpty();
  const db = getDatabase();
  const row = await db.getFirstAsync(`SELECT COUNT(*) as count FROM produtos_cache`);
  return row.count === 0;
}
