const admin = require('firebase-admin');

let credential;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Carregando credencial Firebase via env var...');
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\n/g, '\\n');
    const parsed = JSON.parse(raw);
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    credential = admin.credential.cert(parsed);
    console.log('Credencial Firebase carregada com sucesso.');
  } else {
    console.log('Carregando credencial Firebase via serviceAccountKey.json...');
    credential = admin.credential.cert(require('./serviceAccountKey.json'));
  }
} catch (err) {
  console.error('Erro ao carregar credencial Firebase:', err.message);
  process.exit(1);
}

admin.initializeApp({ credential });

const db = admin.firestore();

module.exports = { db };
