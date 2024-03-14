const mysql = require("mysql");
require("dotenv").config();

const port = 3306;
const dbName = process.env.DB_NAME || 'formbuilder';

const connection = mysql.createConnection({
    port,
    host: 'localhost',
    user: 'root',
    password: '',
    // database: dbName
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
