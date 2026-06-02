import { getDatabase, isWeb } from './database';
import { storage } from './storage';

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function insertPedido(pedido) {
  const id = pedido.id || gerarId();
  const p = { ...pedido, id, status: 'PENDENTE', erro_msg: pedido.erro_msg ?? null, created_at: pedido.created_at ?? Date.now() };
  if (isWeb()) {
    return storage.insertPedido(p);
  }
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO pedidos_pendentes (id, produto, quantidade, status, erro_msg, created_at) VALUES (?, ?, ?, 'PENDENTE', ?, ?)`,
    [p.id, p.produto, p.quantidade, p.erro_msg, p.created_at]
  );
}

export async function getPedidosPendentes() {
  if (isWeb()) return storage.getPedidosPendentes();
  const db = getDatabase();
  return db.getAllAsync(`SELECT * FROM pedidos_pendentes WHERE status IN ('PENDENTE','ERRO') ORDER BY created_at ASC`);
}

export async function updateStatusPedido(id, status, erroMsg) {
  if (isWeb()) return storage.updateStatusPedido(id, status, erroMsg);
  const db = getDatabase();
  await db.runAsync(`UPDATE pedidos_pendentes SET status = ?, erro_msg = ? WHERE id = ?`, [status, erroMsg ?? null, id]);
}

export async function getAllPedidos() {
  if (isWeb()) return storage.getAllPedidos();
  const db = getDatabase();
  return db.getAllAsync(`SELECT * FROM pedidos_pendentes ORDER BY created_at ASC`);
}
