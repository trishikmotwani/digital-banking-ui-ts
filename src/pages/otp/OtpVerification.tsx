import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input automatically
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = (e.currentTarget.previousSibling as HTMLInputElement);
      if (prev) prev.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    console.log("Verifying OTP:", code);
    // Call your verification API here
  };

  return (
    <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: '400px' }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Verify Identity</h2>
        <p className="text-muted small">Enter the 6-digit code sent to your device.</p>
      </div>

      <div className="d-flex gap-2 justify-content-center mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="form-control text-center fw-bold fs-4"
            style={{ width: '45px', height: '50px' }}
            value={data}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <button 
        className="btn btn-primary w-100 py-2 mb-3"
        onClick={handleVerify}
      >
        Verify OTP
      </button>

      <div className="text-center">
        <button className="btn btn-link btn-sm text-decoration-none text-muted">
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
