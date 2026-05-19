const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function enviarSenhaProvisoria({ nome, email, senha }) {
  await transporter.sendMail({
    from: `"Sistema" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Seu acesso ao sistema',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Sua conta foi criada. Use as credenciais abaixo para acessar o sistema:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Senha provisória:</strong> ${senha}</p>
    `,
  });
}

module.exports = { enviarSenhaProvisoria };
