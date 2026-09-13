// Limitador simples de tentativas de login por IP.
// AVISO: em ambiente serverless (Vercel), esta contagem fica na memória da
// função e pode ser reiniciada a qualquer momento (cold start). Isso ainda
// ajuda contra tentativas automatizadas simples, mas para proteção robusta
// contra força bruta em produção séria, considere um serviço dedicado
// (ex: Vercel Firewall / Upstash Redis para contagem persistente).

const tentativas = new Map();

const JANELA_MS = 15 * 60 * 1000;
const LIMITE_TENTATIVAS = 8;

export function limitarTentativasLogin(req, res, next) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "desconhecido";
  const agora = Date.now();

  const registro = tentativas.get(ip);

  if (!registro || agora - registro.primeiraTentativaEm > JANELA_MS) {
    tentativas.set(ip, { count: 1, primeiraTentativaEm: agora });
    return next();
  }

  if (registro.count >= LIMITE_TENTATIVAS) {
    return res.status(429).json({
      erro: "Muitas tentativas de login. Aguarde alguns minutos e tente novamente."
    });
  }

  registro.count += 1;
  next();
}// Limitador simples de tentativas de login por IP.
// AVISO: em ambiente serverless (Vercel), esta contagem fica na memória da
// função e pode ser reiniciada a qualquer momento (cold start). Isso ainda
// ajuda contra tentativas automatizadas simples, mas para proteção robusta
// contra força bruta em produção séria, considere um serviço dedicado
// (ex: Vercel Firewall / Upstash Redis para contagem persistente).

const tentativas = new Map();

const JANELA_MS = 15 * 60 * 1000;
const LIMITE_TENTATIVAS = 8;

export function limitarTentativasLogin(req, res, next) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "desconhecido";
  const agora = Date.now();

  const registro = tentativas.get(ip);

  if (!registro || agora - registro.primeiraTentativaEm > JANELA_MS) {
    tentativas.set(ip, { count: 1, primeiraTentativaEm: agora });
    return next();
  }

  if (registro.count >= LIMITE_TENTATIVAS) {
    return res.status(429).json({
      erro: "Muitas tentativas de login. Aguarde alguns minutos e tente novamente."
    });
  }

  registro.count += 1;
  next();
}