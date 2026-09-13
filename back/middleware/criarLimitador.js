export function criarLimitador({ janelaMs, limite, mensagem }) {
  const registros = new Map();

  return function limitador(req, res, next) {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "desconhecido";
    const agora = Date.now();

    const registro = registros.get(ip);

    if (!registro || agora - registro.primeiraEm > janelaMs) {
      registros.set(ip, { count: 1, primeiraEm: agora });
      return next();
    }

    if (registro.count >= limite) {
      return res.status(429).json({ erro: mensagem });
    }

    registro.count += 1;
    next();
  };
}