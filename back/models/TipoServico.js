import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const TipoServico = banco.define(
  'tipo_servico',
  {
    idtiposervico: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo_cobranca: {
      type: DataTypes.STRING(10), // 'hora' ou 'fixo'
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  },
  {
    tableName: "tipo_servico",
    timestamps: false,
  }
);

export default TipoServico;