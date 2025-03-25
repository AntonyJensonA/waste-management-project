import { pool } from "../config/db.js";

const signupTableQuery = `CREATE TABLE IF NOT EXISTS signup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    house_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const wasteTableQuery = `CREATE TABLE IF NOT EXISTS waste (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(10),
    month VARCHAR(10),
    year VARCHAR(10),
    plastic_kg FLOAT,
    electronic_kg FLOAT,
    bio_kg FLOAT,
    recycle_percentage FLOAT,
    amount FLOAT
);`;

const billingTableQuery = `CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    house_no INT,
    bill_no VARCHAR(50),
    bill_date DATE,
    bill_amount FLOAT
);`;


const wasteRequestTableQuery = `
CREATE TABLE IF NOT EXISTS waste_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  house_number VARCHAR(50) NOT NULL,
  status ENUM('Pending', 'Accepted') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;


const createTable = async (tableName, query) => {
    try {
        await pool.query(query);
        console.log(`${tableName} table created or already exists`);
    } catch (error) {
        console.error(`❌ Error creating ${tableName} table:`, error);
    }
};

const createAllTable = async () => {
    try {
        await createTable("Signup", signupTableQuery);
        await createTable("Waste", wasteTableQuery);
        await createTable("Billing", billingTableQuery);
        await createTable("Waste Requests", wasteRequestTableQuery);
        console.log("✅ All tables created or already exist");
    } catch (error) {
        console.log("❌ Error creating tables:", error);
        throw error;
    }
};



export default createAllTable;
