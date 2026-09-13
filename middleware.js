import jwt from "jsonwebtoken";
import { next } from "@vercel/functions";

export const config = {
  runtime: "nodejs",
matcher: [
    "/",
    "/index.html",
    "/chamado.html",
    "/relatorio.html",
    "/tiposervico.html",
    "/admin-solicitacoes.html",
    "/login.html",
  ],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") || "";
  const token = lerCookie(cookieHeader, "sessao");
  const sessaoValida = token ? verificarToken(token) : false;

  const estaNaTelaDeLogin = url.pathname === "/login.html";

  if (estaNaTelaDeLogin) {
    if (sessaoValida) {
      return Response.redirect(new URL("/index.html", request.url));
    }
    return next();
  }

  if (!sessaoValida) {
    return Response.redirect(new URL("/login.html", request.url));
  }

  return next();
}

function verificarToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

function lerCookie(cookieHeader, nome) {
  const partes = cookieHeader.split(";").map((parte) => parte.trim());

  for (const parte of partes) {
    const [chave, ...resto] = parte.split("=");
    if (chave === nome) return decodeURIComponent(resto.join("="));
  }

  return null;
}