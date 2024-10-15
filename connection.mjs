import { Sequelize } from 'sequelize';

const database = "tienda_teclados";
const username = "postgres";
const password = "7410";
const host = "localhost";

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres',
});

export {
    sequelize
}
