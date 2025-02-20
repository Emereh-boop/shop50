const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Use CORS middleware to handle cross-origin requests
const corsOptions = {
  origin: "*", // Allow all origins (for development, you can restrict this to your specific domain in production)
  methods: ["GET", "POST", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type"], // Allowed headers
};

exports.validateCoupon = functions.https.onRequest((req, res) => {
  // Use the CORS middleware
  cors(corsOptions)(req, res, async () => {
    const { couponCode } = req.body;

    try {
      const couponRef = admin
        .firestore()
        .collection("coupons")
        .where("code", "==", couponCode);
      const couponSnap = await couponRef.get();

      if (couponSnap.empty) {
        return res.status(404).send({ error: "Coupon not found" });
      }

      const coupon = couponSnap.docs[0].data();
      const expires = new Date(coupon.expires);
      const now = new Date();

      if (expires < now) {
        return res.status(400).send({ error: "Coupon has expired" });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).send({ error: "Coupon usage limit exceeded" });
      }

      const discount = coupon.discount || 0;
      const freeShipping = coupon.freeShipping || false;

      return res.status(200).send({ discount, freeShipping });
    } catch (error) {
      console.error("Error validating coupon:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  });
});
