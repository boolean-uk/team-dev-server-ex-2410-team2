import { sendDataResponse } from '../utils/responses.js'

export async function validatePostContent(req, res, next) {
  const validateContent = (content) => {
    const maxLength = 200 // Set maximum length

    if (!content || content.trim() === '') {
      return 'Content cannot be empty or null'
    }
    if (content.length > maxLength) {
      return `Content cannot exceed ${maxLength} characters`
    }
    return null
  }

  const contentError = validateContent(req.body.content)
  if (contentError) {
    return sendDataResponse(res, 400, { content: contentError })
  }

  next()
}
