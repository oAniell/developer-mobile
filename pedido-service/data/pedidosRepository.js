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
    await db.collection(COLECAO).doc(pedido.id).set({
      ...pedido,
      criadoEm: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Pedidos] Erro ao persistir no Firestore:', err.message);
  }
}

module.exports = { carregarDoFirestore, persistirPedido };
