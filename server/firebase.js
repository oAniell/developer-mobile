const admin = require('firebase-admin');

let credential;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\n/g, '\\n'));
  parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  credential = admin.credential.cert(parsed);
} else {
  credential = admin.credential.cert(require('./serviceAccountKey.json'));
}

admin.initializeApp({ credential });

const db = admin.firestore();

module.exports = { db };
