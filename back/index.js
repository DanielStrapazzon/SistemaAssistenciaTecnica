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

const api = Express();
api.use(cors());
api.use(Express.json());

api.get('/teste', (req, res) => {
    res.send('API funcionando');
}); 

api.get('/usuario', UsuarioController.listar);
api.get('/usuario/:id', UsuarioController.selecionar);
api.delete('/usuario/:id', UsuarioController.excluir);
api.post('/usuario', UsuarioController.inserir);
api.put('/usuario/:id', UsuarioController.alterar);

api.get("/chamado/relatorio", ChamadoController.relatorio);

api.get('/chamado', ChamadoController.listar);
api.get('/chamado/:id', ChamadoController.selecionar);
api.delete('/chamado/:id', ChamadoController.excluir);
api.post('/chamado', ChamadoController.inserir);
api.put('/chamado/:id', ChamadoController.alterar);

api.get('/tipo-servico', TipoServicoController.listar);
api.get('/tipo-servico/:id', TipoServicoController.selecionar);
api.delete('/tipo-servico/:id', TipoServicoController.excluir);
api.post('/tipo-servico', TipoServicoController.inserir);
api.put('/tipo-servico/:id', TipoServicoController.alterar);

api.listen(4002, () => { console.log('API Rodando...') });






