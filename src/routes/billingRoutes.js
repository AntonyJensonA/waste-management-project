import express from 'express';
import { getBillingByUser } from '../controllers/billingController.js';

const router = express.Router();

router.get('/user', getBillingByUser);

export default router;
