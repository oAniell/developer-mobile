const admin = require('firebase-admin');

let db = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\n/g, '\\n');
    const parsed = JSON.parse(raw);
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    admin.initializeApp({ credential: admin.credential.cert(parsed) });
    db = admin.firestore();
    console.log('[Estoque] Firebase conectado — dados serão persistidos.');
  } else {
    console.warn('[Estoque] FIREBASE_SERVICE_ACCOUNT não definido — estoque apenas em memória.');
  }
} catch (err) {
  console.error('[Estoque] Erro ao conectar Firebase:', err.message);
}

module.exports = { db };
