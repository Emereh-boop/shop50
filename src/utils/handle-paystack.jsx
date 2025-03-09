export const handlePaystackPayment = async (amount, email, setPaid, setPaymentStatus) => {
    const paystack = window.PaystackPop;
    if (!paystack) {
        return;
    }

    const reference = new Date().getTime(); // Unique reference
    const paymentHandler = paystack?.setup({
        key: "pk_test_95d2fce259eaec967447e10a40e98cc7cc588634",
        email: email,
        amount: amount * 100, // Kobo
        ref: reference,
        callback: function (response) {
            if (response.status === "success") {
                setPaid(true);  // Set paid status to true
                setPaymentStatus("Paid");
            } else {
                setPaid(false);  // Set paid status to false
                setPaymentStatus("Failed");
            }
        },
        onClose: function () {
            setPaid(false);  // In case user cancels, mark payment as pending/failed
            setPaymentStatus("Pending");
        },
    });

    if (paymentHandler) {
        paymentHandler.openIframe();
    } else {
        setPaid(false);  // Handle any errors and mark payment as failed
        setPaymentStatus("Failed");
    }
};
