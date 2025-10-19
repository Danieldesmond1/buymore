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

  const publicKey = "pk_test_170f1eff8df509f1bcaa09f247576b24070025fc";

  // 🟢 Convert USD → NGN and create order first
  const handleConvertAndPay = async () => {
    try {
      if (!activeUser || !activeUser.id) {
        alert("Please log in before proceeding to checkout.");
        return;
      }

      setLoading(true);

      // Step 1️⃣: Create order
      const orderRes = await axios.post("http://localhost:5000/api/orders/place", {
        user_id: activeUser.id,
      });

      const { order_id, total_price } = orderRes.data;
      localStorage.setItem("currentOrderId", order_id);

      // Step 2️⃣: Convert USD → NGN for Paystack
      const convertRes = await axios.get(
        `http://localhost:5000/api/payment/convert/${total_price}`
      );
      setNairaTotal(convertRes.data.ngn);
    } catch (err) {
      alert("Error creating order or converting currency.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 After successful Paystack payment
  const handlePaymentSuccess = async (reference) => {
    try {
      setProcessing(true);
      alert("Verifying payment...");

      // ✅ Retrieve the stored order ID
      const orderId = localStorage.getItem("currentOrderId");

      const verifyRes = await axios.get(
        `http://localhost:5000/api/payment/paystack/verify`,
        {
          params: {
            reference: reference.reference,
            order_id: orderId,
          },
        }
      );

      if (verifyRes.data?.message?.includes("verified")) {
        alert("✅ Payment verified and recorded successfully!");

        // Clear cart data
        localStorage.removeItem("cartItems");
        localStorage.removeItem("currentOrderId");
        window.dispatchEvent(new Event("cartUpdated"));

        // Redirect
        window.location.href = "/payment-success";
      } else {
        alert("Payment verified but not recorded properly. Check backend logs.");
      }
    } catch (err) {
      console.error("❌ Verify error:", err);
      alert("Error verifying payment. Please contact support.");
    } finally {
      setProcessing(false);
    }
  };

  const componentProps = {
    email: activeUser?.email || "projectmailtester@gmail.com",
    amount: (nairaTotal || 0) * 100, // Paystack expects amount in kobo
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
    onClose: () => alert("Payment window closed."),
  };

  return (
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
  );
};

export default CartSummary;