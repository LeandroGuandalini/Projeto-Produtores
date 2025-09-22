// src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};