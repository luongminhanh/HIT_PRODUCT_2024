const otpStore = new Map();

const setOtp = (email, otp, expirationTime) => {
  otpStore.set(email, { otp, expirationTime: Date.now() + expirationTime });
};

const getOtp = (email) => {
  const data = otpStore.get(email);
  if (data && data.expirationTime > Date.now()) {
    return data.otp;
  }
  otpStore.delete(email);
  return null;
};

const deleteOtp = (email) => {
  otpStore.delete(email);
};

module.exports = { setOtp, getOtp, deleteOtp };
