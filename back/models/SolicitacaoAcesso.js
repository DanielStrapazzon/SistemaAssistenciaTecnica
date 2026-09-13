import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const SolicitacaoAcesso = banco.define(
  'solicitacao_acesso',
  {
    idsolicitacao: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false },
    empresa: { type: DataTypes.STRING(150), allowNull: true },
    motivo: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "pendente" },
    criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    decidido_em: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "solicitacao_acesso", timestamps: false }
);

export default SolicitacaoAcesso;