import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency, token } = req.body;

    try {
      // Create a charge using Stripe API
      const charge = await stripe.charges.create({
        amount,
        currency,
        source: token,
      });

      return res.status(200).json(charge);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
