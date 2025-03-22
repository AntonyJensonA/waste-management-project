import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { checkConnection } from './config/db.js';
import createAllTable from './utils/dbUtils.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

const app =express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);

app.listen(3000, async()=>{
    console.log("Server running on port 3000");
    try{
        await checkConnection();
        await createAllTable();
    }
    catch(error){
        console.log("Failed to intialise database",error);
    }
});