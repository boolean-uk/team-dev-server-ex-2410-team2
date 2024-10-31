import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import Comment from '../domain/comment.js'
import User from '../domain/user.js'

// Create a new comment
export const create = async (req, res) => {
  const { content, postId } = req.body
  const user = await User.findById(req.user.id)

  if (!content || !postId) {
    return sendDataResponse(res, 400, {
      error: 'Must provide content, postId, and userId'
    })
  }

  try {
    const createdComment = await Comment.createComment(content, user, postId)
    if (!createdComment) {
      return sendDataResponse(res, 404, { id: 'Comment not found' })
    }

    return sendDataResponse(res, 201, createdComment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return sendMessageResponse(res, 500, 'Unable to create comment')
  }
}

// Update an existing comment
export const update = async (req, res) => {
  const { content, userId } = req.body
  const { id } = req.params
  const commentIdInt = parseInt(id, 10)

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  if (isNaN(commentIdInt)) {
    return sendDataResponse(res, 400, { error: 'Invalid comment ID' })
  }

  try {
    const comment = await Comment.getCommentById(commentIdInt)

    if (!comment) {
      return sendDataResponse(res, 404, { error: 'Comment not found' })
    }

    const updatedComment = await Comment.updateContentById(
      commentIdInt,
      content,
      userId
    )
    return sendDataResponse(res, 200, { comment: updatedComment })
  } catch (error) {
    console.error('Error updating comment:', error)
    return sendDataResponse(res, 500, { error: 'Internal Server Error' })
  }
}

// Delete an existing comment
export const remove = async (req, res) => {
  const { id } = req.params
  const commentIdInt = parseInt(id, 10)

  if (isNaN(commentIdInt)) {
    return sendDataResponse(res, 400, { error: 'Invalid comment ID' })
  }

  try {
    const comment = await Comment.getCommentById(commentIdInt)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    await Comment.deleteCommentById(commentIdInt)
    return res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
