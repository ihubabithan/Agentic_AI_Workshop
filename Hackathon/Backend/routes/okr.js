import express from 'express';
import * as okrController from '../controllers/okrController.js';

const router = express.Router();

router.post('/submit', okrController.submitOKR);
router.get('/', okrController.getOKRs);
router.get('/check-is-your-okr', okrController.checkIsYourOKR);
router.get('/primary', okrController.getPrimaryOKR);
router.get('/all', okrController.getAllOKRs);
router.get('/:id', okrController.getOKRById);

export default router; 