export function exigirAdmin(req, res, next) {
  if (!req.usuario || req.usuario.perfil !== 1) {
    return res.status(403).json({ erro: "Apenas administradores podem acessar este recurso." });
  }
  next();
}