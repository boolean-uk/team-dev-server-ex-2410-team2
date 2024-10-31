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
