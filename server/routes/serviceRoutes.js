import express from 'express';
import { getServices, createService, deleteService, resetAllServices } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', createService);
router.delete('/:id', deleteService);
router.post('/reset-to-defaults', resetAllServices);

export default router;