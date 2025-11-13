import { useState } from "react";
import { FaShippingFast, FaPercent, FaReceipt } from "react-icons/fa";
import { PaystackButton } from "react-paystack";
import axios from "axios";
import "./Styles/CartSummary.css";

const formatterUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatterNGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const CartSummary = ({ cartItems = [], user }) => {
  const [nairaTotal, setNairaTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // 🧩 Fallback for user (in case of page reload)
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const activeUser = user || storedUser;

  // 🧮 Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxRate = 0.001;
  const tax = subtotal * taxRate;
  const shippingFee = subtotal > 50000 ? 0 : 6;
  const totalUSD = subtotal + tax + shippingFee;

  // 🟢 Convert USD → NGN and create order first
  const handleConvertAndPay = async () => {
    try {
      if (!activeUser || !activeUser.id) {
        showToast("Please log in before proceeding to checkout.", "error");
        return;
      }

      setLoading(true);

      // Step 1️⃣: Create order
      const orderRes = await axios.post(`${BASE_URL}/api/orders/place`, {
        user_id: activeUser.id,
      });

      const { order_id, total_price } = orderRes.data;
      localStorage.setItem("currentOrderId", order_id);

      // Step 2️⃣: Convert USD → NGN for Paystack
      const convertRes = await axios.get(
        `${BASE_URL}/api/payment/convert/${total_price}`
      );
      setNairaTotal(convertRes.data.ngn);

      showToast("✅ Amount converted successfully. You can now pay.", "success");
    } catch (err) {
      showToast("Error creating order or converting currency.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 After successful Paystack payment
  const handlePaymentSuccess = async (reference) => {
    try {
      setProcessing(true);
      showToast("Verifying payment...", "info");

      const orderId = localStorage.getItem("currentOrderId");

      const verifyRes = await axios.get(
        `${BASE_URL}/api/payment/paystack/verify`,
        {
          params: {
            reference: reference.reference,
            order_id: orderId,
          },
        }
      );

      if (verifyRes.data?.message?.includes("verified")) {
        showToast("✅ Payment verified and recorded successfully!", "success");

        // Clear cart data
        localStorage.removeItem("cartItems");
        localStorage.removeItem("currentOrderId");
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => {
          window.location.href = "/payment-success";
        }, 1500);
      } else {
        showToast(
          "Payment verified but not recorded properly. Check backend logs.",
          "warning"
        );
      }
    } catch (err) {
      console.error("❌ Verify error:", err);
      showToast("Error verifying payment. Please contact support.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const componentProps = {
    email: activeUser?.email || "projectmailtester@gmail.com",
    amount: (nairaTotal || 0) * 100,
    metadata: {
      name: activeUser?.username || "Test Buyer",
      cart: cartItems,
    },
    publicKey,
    text:
      processing
        ? "Verifying..."
        : nairaTotal
        ? `Pay ${formatterNGN.format(nairaTotal)}`
        : "Convert to NGN",
    onSuccess: handlePaymentSuccess,
    onClose: () => showToast("Payment window closed.", "info"),
  };

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <aside className="cart-summary">
        <h2 className="cart-summary__title">
          <FaReceipt className="icon" /> Order Summary
        </h2>

        <div className="cart-summary__rows">
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatterUSD.format(subtotal)}</span>
          </div>

          <div className="cart-summary__row">
            <span>
              <FaPercent className="icon" /> Tax (0.1%)
            </span>
            <span>{formatterUSD.format(tax)}</span>
          </div>

          <div className="cart-summary__row">
            <span>
              <FaShippingFast className="icon" /> Shipping
            </span>
            <span>
              {shippingFee === 0 ? (
                <strong>Free</strong>
              ) : (
                formatterUSD.format(shippingFee)
              )}
            </span>
          </div>

          <div className="cart-summary__total-row">
            <span>Total (USD)</span>
            <span className="cart-summary__total">
              {formatterUSD.format(totalUSD)}
            </span>
          </div>

          {nairaTotal && (
            <div className="cart-summary__total-row">
              <span>In Naira</span>
              <span className="cart-summary__total">
                {formatterNGN.format(nairaTotal)}
              </span>
            </div>
          )}
        </div>

        {!nairaTotal ? (
          <button
            className="cart-summary__checkout-btn"
            onClick={handleConvertAndPay}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert to NGN"}
          </button>
        ) : (
          <PaystackButton
            className="cart-summary__checkout-btn"
            {...componentProps}
          />
        )}
      </aside>
    </>
  );
};

export default CartSummary;
