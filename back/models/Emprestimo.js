import banco from "../Banco.js";
import { DataTypes } from "sequelize";
import ExemplarController from "../controllers/ExemplarController.js";

//Modelo de emprestimo
const Emprestimo = banco.define(
  'emprestimo',
  {
    idemprestimo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idexemplar: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idusuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    emprestimo: {
      type: DataTypes.TIME, 
      allowNull: false,
    },
    vencimento: {
      type: DataTypes.TIME, 
      allowNull: false,
    },
    devolucao: {
      type: DataTypes.TIME, 
      allowNull: true,
    },  
  },
);

export default Emprestimo;