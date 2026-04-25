import banco from "../Banco.js";
import { DataTypes } from "sequelize";

//Modelo de usuário
const Usuario = banco.define(
  'usuario',
  {
    idusuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    perfil: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
  },
);

export default Usuario;