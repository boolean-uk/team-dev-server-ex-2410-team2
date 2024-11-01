import { sendDataResponse } from '../utils/responses.js'

export async function validateUser(req, res, next) {
  const validateEmail = (email) => {
    if (
      email.length < 7 ||
      email.indexOf('@') <= 0 ||
      !email.slice(-4, -1).includes('.') ||
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

  if (res.locals.skipPasswordValidation) {
    return next()
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

export async function validateProfile(req, res, next) {
  if (!req.body.firstName) {
    return sendDataResponse(res, 400, { firstName: 'First name is required' })
  }
  if (!req.body.lastName) {
    return sendDataResponse(res, 400, { lastName: 'Last name is required' })
  }
  if (!req.body.username) {
    return sendDataResponse(res, 400, { username: 'Username is required' })
  }
  if (!req.body.githubUrl) {
    return sendDataResponse(res, 400, { githubUrl: 'Github URL is required' })
  }
  if (!req.body.mobile) {
    return sendDataResponse(res, 400, { mobile: 'Mobile is required' })
  }
  if (!req.body.specialism) {
    return sendDataResponse(res, 400, { specialism: 'Specialism is required' })
  }
  if (!req.body.startDate) {
    return sendDataResponse(res, 400, { startDate: 'Start date is required' })
  }
  if (!req.body.endDate) {
    return sendDataResponse(res, 400, { endDate: 'End date is required' })
  }
  if (!req.body.role && req.user.role === 'TEACHER') {
    return sendDataResponse(res, 400, { role: 'Role is required' })
  }
  if (!req.body.cohortId && req.user.role === 'TEACHER') {
    return sendDataResponse(res, 400, { cohortId: 'Cohort ID is required' })
  }

  next()
}
