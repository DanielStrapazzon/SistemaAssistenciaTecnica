import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const HorarioExpediente = banco.define(
  'horario_expediente',
  {
    idhorarioexpediente: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idempresa: { type: DataTypes.BIGINT, allowNull: false },
    dia_semana: { type: DataTypes.SMALLINT, allowNull: false },
    hora_inicio: { type: DataTypes.TIME, allowNull: false },
    hora_fim: { type: DataTypes.TIME, allowNull: false },
  },
  { tableName: "horario_expediente", timestamps: false }
);

export default HorarioExpediente;