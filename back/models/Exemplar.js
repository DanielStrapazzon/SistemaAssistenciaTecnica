import banco from "../Banco.js";
import { DataTypes } from "sequelize";

//Modelo de exemplar
const Exemplar = banco.define(
  'exemplar',
  {
    idexemplar: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idobra: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
  },
);

export default Exemplar;