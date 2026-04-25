import Obra from "../models/Obra.js";

//Regras de Negócios

async function listar (req, res) {
  const dados = await Obra.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const idobra = req.params.id;
  const dados = await Obra.findByPk(idobra);
  return res.json(dados);
}

async function excluir (req, res) {
  const idobra = req.params.id;
  const dados = await Obra.destroy({ where: { idobra: idobra } });
  return res.json(dados);
}

async function inserir (req, res) {
  const titulo = req.body.titulo;
  const autor = req.body.autor;
  const isbn = req.body.isbn;
  const editora = req.body.editora;
  const publicacao = req.body.publicacao;
  const edicao = req.body.edicao;
  const categoria = req.body.categoria;
  const foto = req.body.foto;

  const dados = await Obra.create({ 
    titulo: titulo,
    autor: autor,
    isbn: isbn,
    editora: editora,
    publicacao: publicacao,
    edicao: edicao,
    categoria: categoria,
    foto: foto
  });

  return res.json(dados);
}

async function alterar(req, res) {
    const idobra = req.params.id;
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const isbn = req.body.isbn;
    const editora = req.body.editora;
    const publicacao = req.body.publicacao;
    const edicao = req.body.edicao;
    const categoria = req.body.categoria;
    const foto = req.body.foto;

    const dados = await Obra.update({ 
      titulo: titulo, 
      autor: autor, 
      isbn: isbn, 
      editora: editora, 
      publicacao: publicacao, 
      edicao: edicao, 
      categoria: categoria, 
      foto: foto }, 
      {
        where: { idobra: idobra }
    });
    return res.json(dados);
}

export default { listar, selecionar, excluir, inserir, alterar };
