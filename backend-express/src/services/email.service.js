// Пустой сервис для email (ничего не отправляет)
const sendVerificationEmail = async (email, token) => {
  console.log(`[DEV] Would send verification email to ${email} with token ${token}`);
  // Ничего не делаем
};

const sendPasswordResetEmail = async (email, token) => {
  console.log(`[DEV] Would send password reset email to ${email} with token ${token}`);
  // Ничего не делаем
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };