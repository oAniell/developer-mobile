const { db } = require('../firebase');

const COLECAO = 'pedidos';

async function carregarDoFirestore(pedidosArray) {
  if (!db) return;
  try {
    const snapshot = await db.collection(COLECAO).orderBy('criadoEm', 'asc').get();
    pedidosArray.splice(0, pedidosArray.length);
    snapshot.docs.forEach(doc => pedidosArray.push(doc.data()));
    console.log(`[Pedidos] ${pedidosArray.length} pedido(s) carregado(s) do Firestore.`);
  } catch (err) {
    console.error('[Pedidos] Erro ao carregar do Firestore:', err.message);
  }
}

async function persistirPedido(pedido) {
  if (!db) return;
  try {
    const dados = { ...pedido, criadoEm: new Date().toISOString() };
    if (pedido.id) {
      await db.collection(COLECAO).doc(String(pedido.id)).set(dados);
    } else {
      await db.collection(COLECAO).add(dados);
    }
  } catch (err) {
    console.error('[Pedidos] Erro ao persistir no Firestore:', err.message);
  }
}

module.exports = { carregarDoFirestore, persistirPedido };
