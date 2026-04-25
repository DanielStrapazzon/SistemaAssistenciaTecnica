import banco from "../Banco.js";
import { DataTypes } from "sequelize";

//Modelo de usuário
const Aluno = banco.define(
  'aluno',
  {
    matricula: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100), 
    },
  },
);

export default Aluno;