import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency, paymentMethodId } = req.body;

    if (!amount || !currency || !paymentMethodId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Convert amount to the smallest unit (kobo for NGN, cents for USD)
      currency,
      payment_method: paymentMethodId,
      confirm: true, // Auto-confirm
    });

    return res.json({ success: true, paymentIntent });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
