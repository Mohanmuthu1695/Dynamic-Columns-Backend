const mysql = require("mysql");
const fs = require('fs');
require("dotenv").config();

const port = 13212;
const dbName = process.env.DB_NAME || 'defaultdb';

// const connection = mysql.createConnection({
//     port: 13216,
//     host: 'mysql-1fb2cc5f-mohanjividil-0173.a.aivencloud.com',
//     user: 'avnadmin',
//     password: 'AVNS_4YODaTCgXDqNIQodn-E',
//     // authSwitchHandler: (data, cb) => {
//     //     if (data.pluginName === 'caching_sha2_password') {
//     //         // Use the mysql-async-auth library to handle the authentication switch
//     //         require('mysql-async-auth/caching_sha2_password').init(connection.config.password).then((password) => {
//     //             cb(null, password);
//     //         }).catch((err) => {
//     //             cb(err);
//     //         });
//     //     } else {
//     //         cb(new Error(`Unsupported authentication plugin: ${data.pluginName}`));
//     //     }
//     // }
// });
const connection = mysql.createConnection({
  port: 13212,
  host: 'mysql-3a4f7865-mohanjividil-0173.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_xNVZUpnXxNfjThQ8yt5',
  database: 'defaultdb',
  ssl: {
    // Specify the path to your .pem file
    ca: fs.readFileSync('assets/ca.pem'),
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
