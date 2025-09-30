/*const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",       // keep localhost if running MySQL locally
  user: "root",            // replace with your MySQL username
  password: "sohamajwani@2006", // replace with your MySQL password
  database: "library_db"   // the database we created
});

// Connect and test
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

// Export connection so server.js can use it
module.exports = db;*/

// db.js (Updated for Promise-based SQL queries)

const mysql = require("mysql2/promise"); // Using the promise wrapper for async/await

// Create MySQL connection pool (more robust than single connection)
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "sohamajwani@2006",
    database: "library_db"
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log("✅ Connected to MySQL database via Pool.");
        connection.release(); // Release connection back to pool
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
    });

// Export the pool to use its promise-based methods (e.g., pool.query)
module.exports = pool;