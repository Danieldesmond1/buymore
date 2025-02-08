// // controllers/paymentController.js
// import Stripe from 'stripe';
// import db from '../utils/dbConnect';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Process a payment
// export const processPayment = async (req, res) => {
//   const { amount, currency, paymentMethodId, productId, userId } = req.body;

//   try {
//     // 1. Create a payment intent using Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // Amount in cents
//       currency,
//       payment_method: paymentMethodId,
//       confirm: true,
//     });

//     // 2. Log the payment to the database
//     await db.orderModel.create({
//       userId,
//       productId,
//       amount,
//       paymentStatus: 'Paid',
//       paymentId: paymentIntent.id,
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Payment processed successfully',
//       paymentId: paymentIntent.id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Payment failed',
//       error: error.message,
//     });
//   }
// };

// // Fetch all payments (for Admin)
// export const getAllPayments = async (req, res) => {
//   try {
//     const payments = await db.orderModel.findAll();
//     res.status(200).json({
//       success: true,
//       data: payments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch payments',
//       error: error.message,
//     });
//   }
// };

// // Fetch user payments
// export const getUserPayments = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const payments = await db.orderModel.findAll({
//       where: { userId },
//     });

//     res.status(200).json({
//       success: true,
//       data: payments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch user payments',
//       error: error.message,
//     });
//   }
// };
