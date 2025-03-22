import express from 'express';
import { register, login, getUserFromToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/get-user', getUserFromToken);  // ✅ Add this line

export default router;
