export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message:
      password.length < 6 ? "A senha deve ter no mínimo 6 caracteres" : "",
  };
};
