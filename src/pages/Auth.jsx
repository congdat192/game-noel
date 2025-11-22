import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

function Auth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handlePhoneChange = (e) => {
    // Basic formatting for Vietnamese phone numbers
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real-world scenario, you would call your custom backend endpoint
    // that uses your own SMS provider. Supabase's built-in SMS provider
    // might not be ideal for production in Vietnam.
    // For this demo, we use Supabase's method.
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+84${phone.substring(1)}`, // Assuming Vietnamese phone number starting with 0
    });

    if (error) {
      alert(error.message);
    } else {
      setOtpSent(true);
      alert('OTP has been sent to your phone!');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: `+84${phone.substring(1)}`,
      token: otp,
      type: 'sms'
    });

    if (error) {
      alert(error.message);
    }
    // If successful, the user will be logged in, and the main App component
    // will handle the session change.
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Catch & Win</h1>
        <p className="auth-subtitle">Đăng nhập để bắt đầu</p>
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label htmlFor="otp">Mã OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực & Chơi'}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => setOtpSent(false)}
            >
              Nhập lại số điện thoại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;
