import { sendDataResponse } from '../utils/responses.js'

export async function validateUser(req, res, next) {
  const validateEmail = (email) => {
    if (
      email.length < 7 ||
      email.indexOf('@') <= 0 ||
      email.slice(-4) !== '.com' ||
      (email.match(/@/g) || []).length > 1 ||
      email.charAt(email.length - 5) === '@'
    ) {
      return 'Email is invalid'
    }
    return null
  }

  const emailError = validateEmail(req.body.email)
  if (emailError) {
    return sendDataResponse(res, 400, { email: emailError })
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasNumber) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return null
  }

  const passwordError = validatePassword(req.body.password)
  if (passwordError) {
    return sendDataResponse(res, 400, { password: passwordError })
  }

  next()
}
