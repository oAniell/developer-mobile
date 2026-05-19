const bcrypt = require('bcrypt');
const { db } = require('./firebase');

async function seedAdmin() {
  const email = 'admin@admin.com';
  const senha = 'admin123';
  const nome = 'Administrador';
  const perfil = 'admin';

  const existing = await db.collection('auth_users').where('email', '==', email).get();
  if (!existing.empty) {
    console.log('Usuário admin já existe:', email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(senha, 10);
  const ref = await db.collection('auth_users').add({ nome, email, senha: hash, perfil });
  console.log('Admin criado com sucesso!');
  console.log('  ID:', ref.id);
  console.log('  Email:', email);
  console.log('  Senha:', senha);
  process.exit(0);
}

seedAdmin().catch(err => { console.error(err); process.exit(1); });
