import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import { checkConnection} from './config/db.js'; 
import billingRoutes from './routes/billingRoutes.js';
import createAllTable from './utils/dbUtils.js';
import expenseRoutes from './routes/expenseRoutes.js';
import costRoutes from './routes/costRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', workerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/requests', requestRoutes);

// Start server and initialize DB
app.listen(3000, async () => {
  console.log("🚀 Server running on port 3000");
  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
});

