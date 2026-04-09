// Username + Email validation
export function validateUserInfo(username, email) {
  if (!username || !email) {
    return { valid: false, message: "Username and email are required." };
  }

  // Username rules
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: "Username must be 3–20 characters long." };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores.",
    };
  }

  // Email rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format." };
  }

  return { valid: true, message: "Username and email look good." };
}

// Password validation
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: "Password is required." };
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must include at least one uppercase letter." };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must include at least one lowercase letter." };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must include at least one number." };
  }

  return { valid: true, message: "Password is strong." };
}