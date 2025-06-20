import express from 'express';
import okrRoutes from './okr.js';

const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});

// OKR routes
router.use('/okr', okrRoutes);

export default router;
