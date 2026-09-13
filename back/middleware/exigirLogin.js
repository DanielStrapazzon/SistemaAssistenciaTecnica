import jwt from "jsonwebtoken";

// Middleware de autenticação: verifica se existe um cookie de sessão válido.
// Se não houver, bloqueia a requisição com 401 (não autorizado).
export function exigirLogin(req, res, next) {
  const token = req.cookies?.sessao;

  if (!token) {
    return res.status(401).json({ erro: "Não autenticado. Faça login novamente." });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados;
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Sessão inválida ou expirada. Faça login novamente." });
  }
}