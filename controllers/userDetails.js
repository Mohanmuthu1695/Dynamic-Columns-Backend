const { query, response } = require("express");
const connection = require("../config/connection");

require("dotenv").config();

const addUser = async (req, res) => {
    try {
        const { formData, selectedFormId } = req.body;

        // Fetch tableName associated with the selectedFormId
        const query = "SELECT tableName FROM formsschema WHERE id = ?";
        connection.query(query, [selectedFormId], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Form not found" });
            }

            const tableName = results[0].tableName;

            // Fetch existing columns in the database table
            const getColumnsQuery = `SHOW COLUMNS FROM ${tableName}`;
            connection.query(getColumnsQuery, (err, columns) => {
                if (err) {
                    throw err;
                }

                // Extract existing column names
                const existingColumns = columns.map(column => column.Field);

                // Filter formData keys to include only existing columns
                const keys = Object.keys(formData).filter(key => existingColumns.includes(key));

                // Construct column names string
                const columnsString = keys.join(',');

                // Construct placeholders for values in the SQL query
                const placeholders = keys.map(() => '?').join(',');

                // Prepare values to be inserted into the database
                const values = keys.map(key => formData[key]);

                // Construct the SQL query
                const insertQuery = `INSERT INTO ${tableName} (${columnsString}) VALUES (${placeholders})`;

                // Execute the SQL query
                connection.query(insertQuery, values, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    // Fetch the inserted data
                    const insertedId = result.insertId;
                    const selectInsertedDataQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
                    connection.query(selectInsertedDataQuery, [insertedId], (err, insertedData) => {
                        if (err) {
                            throw err;
                        }
                        return res.status(200).json({
                            message: "Form data added successfully",
                            data: insertedData[0] // Assuming only one row is inserted
                        });
                    });
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};







const getUsers = async (req, res) => {
    const tableName = req.params.tableName;
    const query = `SELECT * FROM ${tableName}`;

    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(200).json([{ message: "No data found for the specified table" }]);
        }

        return res.status(200).json(result);
    });
};




module.exports = { addUser,getUsers }
