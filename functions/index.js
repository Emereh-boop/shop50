const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

// Set CORS options
const corsOptions = {
  origin: "*", // Or replace with specific origin, like "http://localhost:3000"
  methods: ["GET", "POST", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type"], // Allowed headers
};

// Use CORS middleware
exports.validateCoupon = functions.https.onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    // Actual validation logic for coupon
    const code = req.body.code;
    try {
      // Query the coupons collection to find the coupon
      const ref = admin.firestore();
      const couponRef = ref.collection("coupons").where("code", "==", code);
      const couponSnap = await couponRef.get();

      // If no coupon is found, return an error
      if (couponSnap.empty) {
        return res.status(404).send({ error: "Coupon not found" });
      }

      const coupon = couponSnap.docs[0].data();
      const expires = coupon.endDate ? new Date(coupon.endDate) : null;
      const now = new Date();

      // Check if the coupon is expired
      if (expires && expires < now) {
        return res.status(400).send({ error: "Coupon has expired" });
      }

      // Check if the coupon's usage limit has been exceeded
      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).send({ error: "Coupon usage limit exceeded" });
      }

      // If valid, send the discount and shipping details
      const discount = coupon.discount || 0;
      const freeShipping = coupon.freeShipping || false;

      return res.status(200).send({ discount, freeShipping });
    } catch (error) {
      console.error("Error validating coupon:", error);
      return res.status(500).send({
        error: "Internal server error",
        details: error.message,
      });
    }
  });
});
