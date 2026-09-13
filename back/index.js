import Express from "express";
import banco from "./Banco.js";

import UsuarioController from "./controllers/UsuarioController.js"; 
import ChamadoController from "./controllers/ChamadoController.js";
import TipoServicoController from "./controllers/TipoServicoController.js";
import AuthController from "./controllers/AuthController.js";
import SolicitacaoAcessoController from "./controllers/SolicitacaoAcessoController.js";
import EmpresaController from "./controllers/EmpresaController.js";
import HorarioExpedienteController from "./controllers/HorarioExpedienteController.js";

import { exigirLogin } from "./middleware/exigirLogin.js";
import { exigirAdmin } from "./middleware/exigirAdmin.js";
import { exigirSuperAdmin } from "./middleware/exigirSuperAdmin.js";
import { limitarTentativasLogin } from "./middleware/limitarTentativasLogin.js";
import { criarLimitador } from "./middleware/criarLimitador.js";

import cors from "cors";
import cookieParser from "cookie-parser";

const api = Express();

api.use(cors({ origin: true, credentials: true }));
api.use(Express.json());
api.use(cookieParser());

const limitarSolicitacaoAcesso = criarLimitador({
  janelaMs: 60 * 60 * 1000,
  limite: 5,
  mensagem: "Muitas solicitações vindas deste endereço. Tente novamente mais tarde.",
});

const limitarEsqueciSenha = criarLimitador({
  janelaMs: 15 * 60 * 1000,
  limite: 5,
  mensagem: "Muitas tentativas. Aguarde alguns minutos antes de tentar de novo.",
});

api.get('/api/teste', (req, res) => {
    res.send('API funcionando');
}); 

api.post('/api/login', limitarTentativasLogin, AuthController.login);
api.post('/api/logout', AuthController.logout);
api.get('/api/me', exigirLogin, AuthController.me);

api.post('/api/esqueci-senha', limitarEsqueciSenha, AuthController.esqueciSenha);
api.post('/api/redefinir-senha', limitarEsqueciSenha, AuthController.redefinirSenha);

api.post('/api/solicitacao-acesso', limitarSolicitacaoAcesso, SolicitacaoAcessoController.criar);

api.use('/api/solicitacao-acesso', exigirLogin, exigirSuperAdmin);
api.get('/api/solicitacao-acesso', SolicitacaoAcessoController.listar);
api.post('/api/solicitacao-acesso/:id/aprovar', SolicitacaoAcessoController.aprovar);
api.post('/api/solicitacao-acesso/:id/rejeitar', SolicitacaoAcessoController.rejeitar);

api.get('/api/empresa', exigirLogin, exigirSuperAdmin, EmpresaController.listar);

api.get('/api/horario-expediente', exigirLogin, HorarioExpedienteController.listar);
api.put('/api/horario-expediente', exigirLogin, exigirAdmin, HorarioExpedienteController.salvar);

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