import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import Comment from '../domain/comment.js'

// Create a new comment
export const create = async (req, res) => {
  const { content, postId, userId } = req.body

  if (!content || !postId || !userId) {
    return sendDataResponse(res, 400, {
      error: 'Must provide content, postId, and userId'
    })
  }

  try {
    const comment = new Comment({
      content,
      userId,
      postId
    })
    const createdComment = await comment.save()

    // Fetch the created comment from the database
    const fetchedComment = await Comment.findById(createdComment.id)
    if (!fetchedComment) {
      return sendDataResponse(res, 404, { id: 'Comment not found' })
    }

    return sendDataResponse(res, 201, fetchedComment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return sendMessageResponse(res, 500, 'Unable to create comment')
  }
}

// Update an existing comment
export const update = async (req, res) => {
  const { content } = req.body
  const { commentId } = req.params

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return sendDataResponse(res, 404, { error: 'Comment not found' })
    }

    const updatedComment = await comment.update(content)
    return sendDataResponse(res, 200, { comment: updatedComment })
  } catch (error) {
    return sendDataResponse(res, 500, { error: 'Internal Server Error' })
  }
}

// Delete an existing comment
export const remove = async (req, res) => {
  const { commentId } = req.params

  try {
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    await comment.delete();
    return res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
