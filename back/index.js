import Express from "express";
import banco from "./Banco.js";

import UsuarioController from "./controllers/UsuarioController.js"; 
import ChamadoController from "./controllers/ChamadoController.js";
import TipoServicoController from "./controllers/TipoServicoController.js";

import cors from "cors";

//Testando a conexão com o banco de dados
try {
  await banco.authenticate();
  console.log('Banco de dados conectado com sucesso!');
} catch (error) {
  console.error('Erro ao conectar ao banco de dados:', error);
}

//Métodos da API

// IMPORTANTE: todas as rotas usam o prefixo /api porque, no Vercel, o
// front-end vai chamar https://seu-projeto.vercel.app/api/... e essa é a
// função serverless que responde por esse caminho (ver /api/index.js e vercel.json).

const api = Express();
api.use(cors());
api.use(Express.json());

api.get('/teste', (req, res) => {
    res.send('API funcionando');
}); 

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

// No Vercel, quem "liga" a API é a própria plataforma (função serverless).
// Só chamamos api.listen() quando rodamos localmente com `node index.js`.
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






