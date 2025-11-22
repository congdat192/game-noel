import { useState } from 'react';
import './Results.css';

// This is a placeholder for a real API call to your backend to send the email
const sendVoucherToEmail = async (email, voucher) => {
  console.log(`Simulating sending voucher ${voucher.code} to ${email}`);
  // In a real app, you'd have a serverless function that uses the Resend SDK
  // await fetch('/api/send-voucher', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, voucher }),
  // });
  return { success: true };
};

function Results({ score, voucher, onPlayAgain, onShare }) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyToClipboard = () => {
    if (!voucher) return;
    navigator.clipboard.writeText(voucher.code);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !voucher) return;
    const result = await sendVoucherToEmail(email, voucher);
    if (result.success) {
      setEmailSent(true);
    } else {
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="results-overlay">
      <div className="results-card">
        <h2>Game Over</h2>
        <p className="final-score">Your Score: <span>{score}</span></p>

        {voucher ? (
          <div className="voucher-section">
            <h3>Congratulations! You've won!</h3>
            <p>A <strong>{voucher.value}</strong> voucher, valid for {voucher.daysValid} days.</p>
            <div className="voucher-code-wrapper">
              <span>{voucher.code}</span>
              <button onClick={handleCopyToClipboard}>
                {isCopying ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            {!emailSent ? (
              <form onSubmit={handleEmailSubmit} className="email-form">
                <input
                  type="email"
                  placeholder="Enter your email to save"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Send to Email</button>
              </form>
            ) : (
              <p className="email-success">Voucher sent to your email!</p>
            )}
          </div>
        ) : (
          <p className="no-voucher">So close! Try again for a chance to win.</p>
        )}

        <div className="results-actions">
          <button onClick={onPlayAgain} className="play-again-btn">Play Again</button>
          <button onClick={onShare} className="share-btn">Share & Get More Plays</button>
        </div>
      </div>
    </div>
  );
}

export default Results;
