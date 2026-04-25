import Emprestimo from "../models/Emprestimo.js";
import Exemplar from "../models/Exemplar.js";
import Usuario from "../models/Usuario.js";
import moment from "moment/moment.js";

//Regras de Negócios
// MVC -> Model, View, Controller

async function listar (req, res) {
  const dados = await Emprestimo.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const idemprestimo = req.params.id;
  const dados = await Emprestimo.findByPk(idemprestimo);
  return res.json(dados);
}

async function emprestar(req,res) {
    try {
        const idexemplar = req.body.idexemplar;
        const idusuario = req.body.idusuario;
        const emprestimo = req.body.emprestimo;
        const vencimento = req.body.vencimento;
        const devolucao = req.body.devolucao;

        // Verificar se o exemplar existe

        const exemplar = await Exemplar.findByPk(idexemplar);
        if (!exemplar) {
            return res.status(400).send({ erro: "Exemplar não encontrado" });
        }
        
        // Verificar se o exemplar está disponível para empréstimo
        if (exemplar.status == 1) {
            return res.status(400).send({ erro: "Exemplar indisponível para empréstimo" });
        }
        
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(idusuario);  
        if (!usuario) {
            return res.status(400).send({ erro: "Usuário não encontrado" });
        }

        // Verificar se o usuário está ativo
        if (usuario.status == 0) {
            return res.status(400).send({ erro: "Usuário inativo" });
        }

        //Data de emprestimo 
        const dataEmprestimo = moment().format('YYYY-MM-DD');
        const dataVencimento = moment().add(7, 'days').format('YYYY-MM-DD');

        if (!dataEmprestimo.isValid()) {
            return res.status(400).send({ erro: "Data de empréstimo inválida" });
        }   

        if (!dataVencimento.isValid()) {
            return res.status(400).send({ erro: "Data de vencimento inválida" });
        }   

        const dados = await Emprestimo.create({
            idexemplar: idexemplar,
            idusuario: idusuario,
            emprestimo: dataEmprestimo,
            vencimento: dataVencimento,
            devolucao: devolucao
        });

        // Atualizar o status do exemplar para indisponível
        exemplar.update({ status: 1 });

        res.json("Empréstimo criado com sucesso.");

    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar empréstimo " + erro});
    }
};

export default { listar, selecionar, emprestar };
