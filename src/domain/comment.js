import dbClient from '../utils/dbClient.js'

export default class Comment {
  /**
   * Converts a database comment object to a Comment instance
   * @param { { id: int, content: string, userId: int, postId: int, user: object, post: object } } comment
   * @returns {Comment}
   */
  static fromDb(comment) {
    return new Comment(
      comment.id,
      comment.content,
      comment.userId,
      comment.postId,
      comment.post
    )
  }

  constructor({
    id = null,
    content,
    user = null,
    post = null,
    userId,
    postId
  }) {
    this.id = id
    this.content = content
    this.userId = userId
    this.user = user
    this.post = post
    this.postId = postId
  }

  toJSON() {
    return {
      comment: {
        id: this.id,
        content: this.content,
        userId: this.userId,
        postId: this.postId,
        user: this.user,
        post: this.post
      }
    }
  }

  /**
   * Saves the comment to the database
   * @param {string} content
   * @param {object} user
   * @param {int} postId
   * @returns {Comment}
   */
  static async createComment(content, user, postId) {
    return dbClient.Comment.create({
      data: {
        content,
        userId: user.id,
        postId
      }
    })
  }

  /**
   * Gets a comment by its ID
   * @param {int} id
   * @returns {Comment}
   */
  static async getCommentById(id) {
    const comment = await dbClient.comment.findUnique({
      where: { id },
      include: {
        user: true,
        post: true
      }
    })
    return comment
      ? new Comment({
          id: comment.id,
          content: comment.content,
          userId: comment.userId,
          postId: comment.postId
        })
      : null
  }

  /**
   * Updates the content of a comment by its ID
   * @param {int} id
   * @param {string} content
   * @returns {Comment}
   */
  static async updateContentById(id, content, userId) {
    return dbClient.comment.update({
      where: { id },
      data: { content, userId }
    })
  }

  /**
   * Deletes a comment by its ID
   * @param {int} id
   * @returns {Comment}
   */
  static async deleteCommentById(id) {
    return dbClient.comment.delete({
      where: { id }
    })
  }

  /**
   * Finds a comment by its ID
   * @param {int} id
   * @returns {Comment}
   */
  static async findById(id) {
    console.log(id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid comment ID')
    }
    const comment = await dbClient.comment.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: {
          include: { profile: true }
        },
        post: true
      }
    })

    return comment
      ? new Comment({
          id: comment.id,
          content: comment.content,
          userId: comment.userId,
          postId: comment.postId,
          user: comment.user,
          post: comment.post
        })
      : null
  }

  /**
   * Finds comments by post ID
   * @param {int} postId
   * @returns {Comment[]}
   */
  static async findByPostId(postId) {
    try {
      const foundComments = await dbClient.comment.findMany({
        where: { postId },
        include: {
          user: true,
          post: true
        }
      })

      return foundComments.map((comment) => Comment.fromDb(comment))
    } catch (error) {
      console.error('Error finding comments by post ID:', error)
      throw new Error('Error finding comments by post ID')
    }
  }
}
