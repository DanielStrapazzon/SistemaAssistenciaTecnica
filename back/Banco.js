import { Sequelize } from "sequelize";
import pg from "pg"; // import explícito: necessário para o Vercel empacotar o driver do Postgres na função serverless

//Configuração do banco de dados
//const banco = new Sequelize('banco1', 'postgres', '2712', {
//  host: 'localhost',
//  port: 5432,
//  dialect: 'postgres',
//  define: {
//    timestamps: false,
//    freezeTableName: true
//  }


// Usa a variável de ambiente DATABASE_URL (se existir, ex: na Vercel/Render), 
// caso contrário, usa os dados locais para quando você rodar na sua máquina.
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:2712@localhost:5432/banco1';

const banco = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectModule: pg, // força o Sequelize a usar o pg importado acima, em vez de carregá-lo dinamicamente
    protocol: 'postgres',
    dialectOptions: {
        // Necessário caso o Render exija SSL para conexões externas
        ssl: process.env.DATABASE_URL ? { require: true, rejectUnauthorized: false } : false
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default banco;