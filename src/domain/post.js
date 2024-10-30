import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      post: {
        id: this.id,
        content: this.content,
        userId: this.userId
      }
    }
  }

  static async createPost(content, user) {
    return dbClient.post.create({
      data: { content: content, userId: user.id }
    })
  }

  static async getAllPosts() {
    return dbClient.post.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })
  }

  static async getPostById(id) {
    return dbClient.post.findUnique({
      where: {
        id: id
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })
  }

  // firstName lastName rolle specialism

  static async updateContentById(id, content) {
    return dbClient.post.update({
      where: { id: id },
      data: { content: content }
    })
  }

  static async deletePostById(id) {
    return dbClient.post.delete({
      where: { id: id }
    })
  }
}
