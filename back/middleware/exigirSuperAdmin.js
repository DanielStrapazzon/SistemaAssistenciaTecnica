export function exigirSuperAdmin(req, res, next) {
  if (!req.usuario || req.usuario.super_admin !== true) {
    return res.status(403).json({ erro: "Apenas o administrador da plataforma pode acessar este recurso." });
  }
  next();
}