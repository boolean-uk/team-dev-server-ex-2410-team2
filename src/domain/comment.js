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
      comment.postId
    )
  }

  constructor({ id, content, userId, postId }) {
    this.id = id
    this.content = content
    this.userId = userId
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
   * @returns {Comment}
   */
  async save() {
    try {
      const createdComment = await dbClient.comment.create({
        data: {
          content: this.content,
          userId: this.userId,
          postId: this.postId
        },
        include: {
          user: true,
          post: true
        }
      })

      return Comment.fromDb(createdComment)
    } catch (error) {
      console.error('Error saving comment:', error)
      throw new Error('Error saving comment')
    }
  }

  async update(content) {
    try {
      const updatedComment = await dbClient.comment.update({
        where: { id: this.id },
        data: { content },
        include: {
          user: true,
          post: true
        }
      })

      return Comment.fromDb(updatedComment)
    } catch (error) {
      console.error('Error updating comment:', error)
      throw new Error('Error updating comment')
    }
  }

  static async _findByUnique(field, value) {
    if (!value) {
      throw new Error(`${field} is required to find a comment`);
    }

    try {
      const comment = await dbClient.comment.findUnique({
        where: { [field]: parseInt(value, 10) },
        include: {
          user: true,
          post: true
        }
      })

      if (!comment) {
        throw new Error('Comment not found');
      }

      return Comment.fromDb(comment)
    } catch (error) {
      console.error(`Error finding comment by ${field}:`, error);
      throw new Error(`Error finding comment by ${field}`);
    }
  }

  /**
   * Deletes the comment from the database
   * @returns {boolean}
   */
  async delete() {
    try {
      await dbClient.comment.delete({
        where: { id: this.id }
      })

      return true
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw new Error('Error deleting comment')
    }
  }

  /**
   * Finds a comment by its ID
   * @param {int} id
   * @returns {Comment}
   */
  static async findById(id) {
    return Comment._findByUnique('id', id)
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
