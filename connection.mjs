import { Sequelize } from 'sequelize';

const database = process.env.DB_NAME || "api_teclados";
const username = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "7410";
const host = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres',
});

export {
    sequelize
}
