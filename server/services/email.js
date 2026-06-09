const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarSenhaProvisoria({ nome, email, senha }) {
  await resend.emails.send({
    from: 'Vendly <onboarding@resend.dev>',
    to: email,
    subject: 'Seu acesso ao Vendly',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Sua conta foi criada no <strong>Vendly</strong>. Use as credenciais abaixo para acessar o sistema:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Senha provisória:</strong> ${senha}</p>
      <p>Recomendamos trocar sua senha após o primeiro acesso.</p>
    `,
  });
}

module.exports = { enviarSenhaProvisoria };
