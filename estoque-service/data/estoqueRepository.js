const { db } = require('../firebase');

const COLECAO = 'estoque';

async function carregarDoFirestore(estoqueArray) {
  if (!db) return;
  try {
    const snapshot = await db.collection(COLECAO).get();
    if (snapshot.empty) {
      // Primeira execução: persiste os dados padrão
      for (const item of estoqueArray) {
        await db.collection(COLECAO).doc(item.produto).set(item);
      }
      console.log('[Estoque] Dados iniciais persistidos no Firestore.');
      return;
    }
    estoqueArray.splice(0, estoqueArray.length);
    snapshot.docs.forEach(doc => estoqueArray.push(doc.data()));
    console.log(`[Estoque] ${estoqueArray.length} item(s) carregado(s) do Firestore.`);
  } catch (err) {
    console.error('[Estoque] Erro ao carregar do Firestore:', err.message);
  }
}

async function persistirItem(produto, quantidade) {
  if (!db) return;
  try {
    await db.collection(COLECAO).doc(produto).set({ produto, quantidade });
  } catch (err) {
    console.error('[Estoque] Erro ao persistir no Firestore:', err.message);
  }
}

module.exports = { carregarDoFirestore, persistirItem };
