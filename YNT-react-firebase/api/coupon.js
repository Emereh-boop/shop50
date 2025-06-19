export default function coupon(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { code } = req.body;

    // Example: Define valid coupon codes
    const coupons = {
        "SAVE10": 10,  // 10% discount
        "SAVE20": 20,  // 20% discount
    };

    if (coupons[code]) {
        return res.json({ success: true, discount: coupons[code] });
    } else {
        return res.status(400).json({ error: "Invalid coupon code" });
    }
}
