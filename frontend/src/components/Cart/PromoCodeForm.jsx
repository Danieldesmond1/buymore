import { useState } from 'react';
import './Styles/PromoCodeForm.css';

const PromoCodeForm = ({ onApplyPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setPromoCode(e.target.value.toUpperCase());
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (promoCode.trim() === '') {
      setError('Please enter a promo code.');
      setSuccess('');
      return;
    }

    // Pass promoCode to parent handler, simulate API call here
    const isValid = onApplyPromo(promoCode);

    if (isValid) {
      setSuccess('Promo code applied successfully!');
      setError('');
    } else {
      setError('Invalid promo code. Please try again.');
      setSuccess('');
    }
  };

  return (
    <form className="promo-code-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="promoCode" className="promo-code-label">
        Have a promo code?
      </label>

      <div className="promo-code-input-group">
        <input
          id="promoCode"
          name="promoCode"
          type="text"
          className={`promo-code-input ${error ? 'error' : ''}`}
          placeholder="Enter promo code"
          value={promoCode}
          onChange={handleChange}
          aria-describedby="promoCodeHelp"
          aria-invalid={error ? "true" : "false"}
        />
        <button type="submit" className="promo-code-btn" aria-label="Apply promo code">
          Apply
        </button>
      </div>

      <div
        id="promoCodeHelp"
        className={`promo-code-message ${error ? 'error' : success ? 'success' : ''}`}
        role={error ? 'alert' : 'status'}
        aria-live="polite"
      >
        {error || success}
      </div>
    </form>
  );
};

export default PromoCodeForm;
