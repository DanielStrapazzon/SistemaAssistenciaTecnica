import { Sequelize } from "sequelize";

//Configuração do banco de dados
const banco = new Sequelize('banco1', 'postgres', '2712', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

export default banco;