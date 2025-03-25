import express from 'express';
import { createWasteRequest, getWasteRequests, acceptWasteRequest } from '../controllers/requestController.js';

const router = express.Router();

router.post('/request-waste', createWasteRequest);
router.get('/waste-requests', getWasteRequests);
router.put('/accept-request/:id', acceptWasteRequest);

export default router;
