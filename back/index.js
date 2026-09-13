import Express from "express";
import banco from "./Banco.js";

import UsuarioController from "./controllers/UsuarioController.js"; 
import ChamadoController from "./controllers/ChamadoController.js";
import TipoServicoController from "./controllers/TipoServicoController.js";
import AuthController from "./controllers/AuthController.js";

import { exigirLogin } from "./middleware/exigirLogin.js";
import { limitarTentativasLogin } from "./middleware/limitarTentativasLogin.js";

import cors from "cors";
import cookieParser from "cookie-parser";

const api = Express();

api.use(cors({ origin: true, credentials: true }));
api.use(Express.json());
api.use(cookieParser());

api.get('/api/teste', (req, res) => {
    res.send('API funcionando');
}); 

api.post('/api/login', limitarTentativasLogin, AuthController.login);
api.post('/api/logout', AuthController.logout);
api.get('/api/me', exigirLogin, AuthController.me);

api.use(['/api/usuario', '/api/chamado', '/api/tipo-servico'], exigirLogin);

api.get('/api/usuario', UsuarioController.listar);
api.get('/api/usuario/:id', UsuarioController.selecionar);
api.delete('/api/usuario/:id', UsuarioController.excluir);
api.post('/api/usuario', UsuarioController.inserir);
api.put('/api/usuario/:id', UsuarioController.alterar);

api.get("/api/chamado/relatorio", ChamadoController.relatorio);

api.get('/api/chamado', ChamadoController.listar);
api.get('/api/chamado/:id', ChamadoController.selecionar);
api.delete('/api/chamado/:id', ChamadoController.excluir);
api.post('/api/chamado', ChamadoController.inserir);
api.put('/api/chamado/:id', ChamadoController.alterar);

api.get('/api/tipo-servico', TipoServicoController.listar);
api.get('/api/tipo-servico/:id', TipoServicoController.selecionar);
api.delete('/api/tipo-servico/:id', TipoServicoController.excluir);
api.post('/api/tipo-servico', TipoServicoController.inserir);
api.put('/api/tipo-servico/:id', TipoServicoController.alterar);

if (!process.env.VERCEL) {
  try {
    await banco.authenticate();
    console.log('Banco de dados conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }

  api.listen(4002, () => { console.log('API Rodando em http://localhost:4002 (rotas em /api/...)') });
}

export default api;