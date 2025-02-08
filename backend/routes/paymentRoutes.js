// // routes/paymentRoutes.js
// import express from 'express';
// import {
//   processPayment,
//   getAllPayments,
//   getUserPayments,
// } from '../controllers/paymentController.js';

// import { adminAuth, userAuth } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Route to process a payment (User route)
// router.post('/process', userAuth, processPayment);

// // Route to get all payments (Admin route)
// router.get('/all', adminAuth, getAllPayments);

// // Route to get payments for a specific user (User route)
// router.get('/:userId', userAuth, getUserPayments);

// export default router;
