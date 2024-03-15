// const { query, response } = require("express");
// const connection = require("../config/connection");

// require("dotenv").config();

// const addUser = async (req, res) => {
//     try {
//         const { formData, selectedFormId } = req.body;

//         // Fetch tableName and tableId associated with the selectedFormId
//         const query = "SELECT id, tableName FROM formsschema WHERE id = ?";
//         connection.query(query, [selectedFormId], (err, results) => {
//             if (err) {
//                 throw err;
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Form not found" });
//             }

//             const { id: tableId, tableName } = results[0];

//             // Construct the SQL query to add the 'status' column if it doesn't exist
//             // const addStatusColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS status BOOLEAN DEFAULT FALSE`;
//             // connection.query(addStatusColumnQuery, (err) => {
//             //     if (err) {
//             //         throw err;
//             //     }
//             // });

//                 // Fetch existing columns in the database table
//                 const getColumnsQuery = `SHOW COLUMNS FROM ${tableName}`;
//                 connection.query(getColumnsQuery, (err, columns) => {
//                     if (err) {
//                         throw err;
//                     }
//                 });

//                     // Extract existing column names
//                     const existingColumns = columns.map(column => column.Field);

//                     // Filter formData keys to include only existing columns
//                     const keys = Object.keys(formData).filter(key => existingColumns.includes(key));

//                     // Construct column names string
//                     const columnsString = keys.join(',');

//                     // Construct placeholders for values in the SQL query
//                     const placeholders = keys.map(() => '?').join(',');

//                     // Prepare values to be inserted into the database
//                     const values = keys.map(key => formData[key]);

//                     // Add 'status' to the columns
//                     keys.push('status');
//                     values.push(false);

//                     // Construct the SQL query
//                     const insertQuery = `INSERT INTO ${tableName} (${columnsString}, status) VALUES (${placeholders}, ?)`;

//                     // Execute the SQL query
//                     connection.query(insertQuery, [...values, false], (err, result) => {
//                         if (err) {
//                             throw err;
//                         }

//                         // Fetch the inserted data
//                         const insertedId = result.insertId;
//                         const selectInsertedDataQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
//                         connection.query(selectInsertedDataQuery, [insertedId], (err, insertedData) => {
//                             if (err) {
//                                 throw err;
//                             }

//                             // Modify the 'status' value before sending the response
//                             const responseData = insertedData[0];
//                             // responseData.status = responseData.status === 1 ? 'enabled' : 'disabled';
//                             responseData.tableId = tableId; // Include the table ID in the response

//                             return res.status(200).json({
//                                 message: "Form data added successfully",
//                                 data: responseData
//                             });
//                         });
//                     });
//                 });
//             });
//         });
//     } catch (err) {
//         return res.status(500).json({ message: "Internal server error", error: err });
//     }
// };



// const getUsers = async (req, res) => {
//     const tableName = req.params.tableName;
//     const query = `SELECT * FROM ${tableName}`;

//     connection.query(query, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }

//         if (result.length === 0) {
//             return res.status(200).json([{ message: "No data found for the specified table" }]);
//         }

//         return res.status(200).json(result);
//     });
// };


// const updateUserStatus = async (req, res) => {
//     try {
//         const { userId, tableId, status } = req.query; // Extract parameters from query
//         const statusValue = status === 'true' ? 1 : 0; // Convert 'true' to 1, 'false' to 0

//         // Fetch tableName associated with the tableId
//         const query = "SELECT tableName FROM formsschema WHERE id = ?";
//         connection.query(query, [tableId], (err, results) => {
//             if (err) {
//                 throw err;
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Table not found" });
//             }

//             const tableName = results[0].tableName;

//             // Construct the SQL query to update the status
//             const updateStatusQuery = `UPDATE ${tableName} SET status = ? WHERE id = ?`;

//             // Execute the SQL query
//             connection.query(updateStatusQuery, [statusValue, userId], (err, result) => {
//                 if (err) {
//                     throw err;
//                 }

//                 return res.status(200).json({ message: "User status updated successfully" });
//             });
//         });
//     } catch (err) {
//         return res.status(500).json({ message: "Internal server error", error: err });
//     }
// };




// module.exports = { addUser,getUsers,updateUserStatus }

const { query, response } = require("express");
const connection = require("../config/connection");

require("dotenv").config();

const addUser = async (req, res) => {
    try {
        const { formData, selectedFormId } = req.body;

        // Fetch tableName and tableId associated with the selectedFormId
        const query = "SELECT id, tableName FROM formsschema WHERE id = ?";
        connection.query(query, [selectedFormId], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Form not found" });
            }

            const { id: tableId, tableName } = results[0];

            // Fetch existing columns in the database table
            const getColumnsQuery = `SHOW COLUMNS FROM ${tableName}`;
            connection.query(getColumnsQuery, (err, columns) => {
                if (err) {
                    throw err;
                }

                // Extract existing column names
                const existingColumns = columns.map(column => column.Field);

                // Filter formData keys to include only existing columns
                const keys = Object.keys(formData).filter(key => existingColumns.includes(key) || key === 'status');

                // Construct column names string
                const columnsString = keys.join(',');

                // Construct placeholders for values in the SQL query
                const placeholders = keys.map(() => '?').join(',');

                // Prepare values to be inserted into the database
                const values = keys.map(key => formData[key]);

                // Construct the SQL query without 'status' column
                const insertQuery = `INSERT INTO ${tableName} (${columnsString}) VALUES (${placeholders})`;

                // Execute the SQL query without 'status' column
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

                        // Modify the 'status' value before sending the response
                        const responseData = insertedData[0];
                        // responseData.status = responseData.status === 1 ? 'enabled' : 'disabled';
                        responseData.tableId = tableId; // Include the table ID in the response

                        return res.status(200).json({
                            message: "Form data added successfully",
                            data: responseData
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


const updateUserStatus = async (req, res) => {
    try {
        const { userId, tableId, status } = req.query; // Extract parameters from query
        const statusValue = status === 'true' ? 1 : 0; // Convert 'true' to 1, 'false' to 0

        // Fetch tableName associated with the tableId
        const query = "SELECT tableName FROM formsschema WHERE id = ?";
        connection.query(query, [tableId], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Table not found" });
            }

            const tableName = results[0].tableName;

            // Construct the SQL query to update the status
            const updateStatusQuery = `UPDATE ${tableName} SET status = ? WHERE id = ?`;

            // Execute the SQL query
            connection.query(updateStatusQuery, [statusValue, userId], (err, result) => {
                if (err) {
                    throw err;
                }

                return res.status(200).json({ message: "User status updated successfully" });
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

module.exports = { addUser,getUsers,updateUserStatus }