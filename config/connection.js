const mysql = require("mysql");
require("dotenv").config();

const port = 3306;
const dbName = process.env.DB_NAME || 'defaultdb';

const connection = mysql.createConnection({
    port: 13212,
    host: 'mysql-1272cfb7-mohanjividil-0173.a.aivencloud.com',
    user: 'User',
    password: 'AVNS_y1X05hhwgTYiNGMIQnY',
    authPlugins: {
        mysql_native_password: () => require('mysql/lib/auth/plugins/mysql_native_password').sha256_password
    }
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log(`Database connected on port ${port} with database: ${dbName}`);

    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) {
            console.error("Error creating database:", err);
            return;
        }

        console.log(`Database ${dbName} created successfully`);

        connection.changeUser({ database: dbName }, (err) => {
            if (err) {
                console.error("Error changing to database:", err);
                return;
            }

            console.log(`Connected to database: ${dbName}`);

            const queries = [
                `CREATE TABLE IF NOT EXISTS formsschema (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    json LONGTEXT,
                    formname LONGTEXT,
                    tableName LONGTEXT
                )`,
                `CREATE TABLE IF NOT EXISTS UserData (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    formsschema_id INT,
                    json LONGTEXT,
                    FOREIGN KEY (formsschema_id) REFERENCES formsschema(id)
                )`
            ];

            queries.forEach((query) => {
                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error creating table:', err);
                        return;
                    }

                    console.log('Table created successfully');
                });
            });

        });
    });
});

module.exports = connection;
