import Express from "express";
import banco from "./Banco.js";
import AlunoController from "./controllers/AlunoController.js";
import UsuarioController from "./controllers/UsuarioController.js"; 
import ObraController from "./controllers/ObraController.js";
import ExemplarController from "./controllers/ExemplarController.js";
import EmprestimoController from "./controllers/EmprestimoController.js";
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

api.get('/aluno', AlunoController.listar);
api.get('/aluno/:matricula', AlunoController.selecionar);
api.delete('/aluno/:matricula', AlunoController.excluir);
api.post('/aluno', AlunoController.inserir);
api.put('/aluno/:matricula', AlunoController.alterar);

api.get('/usuario', UsuarioController.listar);
api.get('/usuario/:id', UsuarioController.selecionar);
api.delete('/usuario/:id', UsuarioController.excluir);
api.post('/usuario', UsuarioController.inserir);
api.put('/usuario/:id', UsuarioController.alterar);

api.get('/obra', ObraController.listar);
api.get('/obra/:id', ObraController.selecionar);
api.delete('/obra/:id', ObraController.excluir);
api.post('/obra', ObraController.inserir);
api.put('/obra/:id', ObraController.alterar);

api.get('/exemplar', ExemplarController.listar);
api.get('/exemplar/:id', ExemplarController.selecionar);
api.delete('/exemplar/:id', ExemplarController.excluir);
api.post('/exemplar', ExemplarController.inserir);

api.get('/emprestimo', EmprestimoController.listar);
api.get('/emprestimo/:id', EmprestimoController.selecionar);
api.post('/emprestar', EmprestimoController.emprestar);

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






