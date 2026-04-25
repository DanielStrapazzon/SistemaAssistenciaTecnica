import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Chamado = banco.define(
  'chamado',
  {
    idchamado: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_abertura: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idtiposervico: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tempo_horas: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "aberto",
    },
  },
  {
    tableName: "chamado",
    timestamps: false,
  }
);

export default Chamado;