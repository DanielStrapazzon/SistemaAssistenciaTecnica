import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REMETENTE = process.env.EMAIL_REMETENTE || "Assistência Técnica <onboarding@resend.dev>";

export async function enviarCodigoRedefinicao(destinatario, codigo) {
  return resend.emails.send({
    from: EMAIL_REMETENTE,
    to: destinatario,
    subject: "Seu código para redefinir a senha",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#172033;">Redefinição de senha</h2>
        <p style="color:#667085;">Use o código abaixo para redefinir sua senha. Ele expira em 15 minutos.</p>
        <div style="background:#f1f5f9; border-radius:8px; padding:20px; text-align:center; margin:24px 0;">
          <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#2458d3;">${codigo}</span>
        </div>
        <p style="color:#667085; font-size:13px;">Se você não pediu essa redefinição, pode ignorar este e-mail com segurança — sua senha continua a mesma.</p>
      </div>
    `,
  });
}