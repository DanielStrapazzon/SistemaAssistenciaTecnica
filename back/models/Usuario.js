import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Usuario = banco.define(
  'usuario',
  {
    idusuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    matricula: { type: DataTypes.STRING, allowNull: false },
    idempresa: { type: DataTypes.BIGINT, allowNull: false },
    senha_hash: { type: DataTypes.STRING, allowNull: false },
    reset_codigo_hash: { type: DataTypes.STRING, allowNull: true },
    reset_expira_em: { type: DataTypes.DATE, allowNull: true },
    reset_tentativas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    perfil: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false },
  },
);

export default Usuario;