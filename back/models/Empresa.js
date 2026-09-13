import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Empresa = banco.define(
  'empresa',
  {
    idempresa: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: { type: DataTypes.STRING(150), allowNull: false },
    criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "empresa", timestamps: false }
);

export default Empresa;