import { sendDataResponse } from '../utils/responses.js'
import Post from '../domain/post.js'

export async function validatePostOwnership(req, res, next) {
  const { id: postId } = req.params
  const { id: userId, role: userRole } = req.user

  try {
    const post = await Post.getPostById(Number(postId))
    if (!post) {
      return sendDataResponse(res, 404, { content: 'Post not found' })
    }

    if (post.user.id === userId || userRole === 'TEACHER') {
      return next()
    }

    return sendDataResponse(res, 401, { content: 'Unauthorized' })
  } catch (error) {
    return sendDataResponse(res, 500, { content: 'Internal server error' })
  }
}

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

export async function validatePostExists(req, res, next) {
  const { id: postId } = req.params

  try {
    const post = await Post.getPostById(Number(postId))
    if (!post) {
      return sendDataResponse(res, 404, { content: 'Post not found' })
    }
    req.post = post
    next()
  } catch (error) {
    return sendDataResponse(res, 500, { content: 'Internal server error' })
  }
}
