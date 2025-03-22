import { pool } from "../config/db.js";

const signupTableQuery = `CREATE TABLE IF NOT EXISTS signup (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            house_number VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`

const createTable = async(tableName ,query)=>{
    try{
        await pool.query(query);
        console.log(`${tableName} table created or already exists`);
    }
    catch(error){
        console.log("Something went wrong",error);
    }
}

const createAllTable =async()=>{
    try
    {
        await createTable("Signup", signupTableQuery);
        console.log("All tables created");
    }
    catch(error){
        console.log("Error creating tables",error);
        throw error;
    }
};

export default createAllTable;