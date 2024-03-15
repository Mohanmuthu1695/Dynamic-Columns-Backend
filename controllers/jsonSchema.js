const { query, response } = require("express");
const connection = require("../config/connection");

require("dotenv").config();

// add jsonSchema

const addSchema = async (req, res) => {
  try {
      const { formName, generatedForm } = req.body;

      // Function to convert label with spaces to camelCase
      const toCamelCase = (label) => {
          const camelCaseString = label.replace(/\w\S*/g, function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }).replace(/\s+/g, '');

          // Convert the first character to lowercase
          return camelCaseString.charAt(0).toLowerCase() + camelCaseString.slice(1);
      };

      const toSmall = (label) => {
          return label.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s+/g, '').toLowerCase();
      };

      // Filter out components with type "button" and create table columns based on generatedForm components
      const columns = generatedForm.components
          .filter(component => component.type !== "button")
          .map(component => `${toCamelCase(component.label)} TEXT`)
          .join(',');

      // Append 'status' column to the columns list
      const columnsWithStatus = `${columns}, status BOOLEAN DEFAULT FALSE`;

      // Insert the JSON data into the database along with the form name and table name
      const insertQuery = "INSERT INTO formsschema (json, formname, tableName) VALUES (?, ?, ?)";
      const tableName = toSmall(formName);
      connection.query(insertQuery, [JSON.stringify(generatedForm), formName, tableName], (err, result) => {
          if (err) {
              throw err;
          }

          // Create a table based on the formName and its components including the 'status' column
          const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
              id INT AUTO_INCREMENT PRIMARY KEY,
              ${columnsWithStatus}
          )`;
          connection.query(createTableQuery, (err, results) => {
              if (err) {
                  throw err;
              }
              console.log('Table created successfully');
          });

          // Return the inserted data as a response
          return res.status(200).json({
              message: "Form JSON Schema added successfully",
              data: { formName, generatedForm }
          });
      });
  } catch (err) {
      // Handle any errors
      return res.status(500).json(err);
  }
};



module.exports = connection;





  
  const getSchema = async (req, res) => {
    const id = req.params.id;
    let query;
  if(id === '0' || id=== null){
    query = "SELECT json FROM formsschema ORDER BY id DESC LIMIT 1";
  }
    else if (id) {
      // If ID is provided, retrieve the row with that ID
      query = "SELECT json FROM formsschema WHERE id = ?";
    }
  
    connection.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Schema not found" });
      }
      const jsonSchema = JSON.parse(result[0].json);
  
      // Count the total number of rows in the formsschema table
      connection.query("SELECT COUNT(*) AS count FROM formsschema", (err, countResult) => {
        if (err) {
          return res.status(500).json(err);
        }
        
        // Include the count in the response
        const count = countResult[0].count;
        return res.status(200).json({ count, jsonSchema });
      });
    });
  };
  
  const getID = async (req, res) => {
    try {
        // Query to select id and formname from formsschema table
        const query = "SELECT id, formname,tableName FROM formsschema";
        
        // Execute the query
        connection.query(query, (err, result) => {
            if (err) {
                // If there's an error, return an error response
                return res.status(500).json({ error: err.message });
            }

            // If the query is successful, return the result as JSON
            return res.status(200).json({ data: result });
        });
    } catch (err) {
        // If an exception occurs, return an error response
        return res.status(500).json({ error: err.message });
    }
};

  
  module.exports={addSchema,getSchema,getID}
