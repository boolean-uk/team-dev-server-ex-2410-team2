import Post from '../models/Post.js'

export async function validatePostOwnership(req, res, next) {
  const { id: postId } = req.params
  const userId = req.user.id
  const userRole = req.user.role

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.userId === userId || userRole === 'TEACHER') {
      return next()
    }

    return res
      .status(403)
      .json({ message: 'Forbidden: Not authorized to modify this post' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
}
