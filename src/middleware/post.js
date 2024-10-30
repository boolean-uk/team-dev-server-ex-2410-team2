import { sendDataResponse } from '../utils/responses.js'

export async function validatePostContent(req, res, next) {
  const { content } = req.body
  const maxLength = 200

  if (!content || content.trim() === '') {
    return sendDataResponse(res, 400, {
      content: 'Content cannot be empty or null'
    })
  }

  if (content.length > maxLength) {
    return sendDataResponse(res, 400, {
      content: `Content cannot exceed ${maxLength} characters`
    })
  }

  next()
}
