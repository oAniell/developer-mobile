async function enviarSenhaProvisoria({ nome, email, senha }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[Email] BREVO_API_KEY não configurado — email não enviado');
    return;
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Vendly', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email, name: nome }],
      subject: 'Seu acesso ao Vendly',
      htmlContent: `
        <h2>Olá, ${nome}!</h2>
        <p>Sua conta foi criada no <strong>Vendly</strong>. Use as credenciais abaixo para acessar:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha provisória:</strong> <span style="font-size:18px;font-weight:bold">${senha}</span></p>
        <p style="color:#888">Recomendamos trocar sua senha após o primeiro acesso.</p>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erro ao enviar email');
  }
}

module.exports = { enviarSenhaProvisoria };
