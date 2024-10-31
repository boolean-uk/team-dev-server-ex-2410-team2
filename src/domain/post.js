import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(
    id = null,
    content = '',
    user = null,
    createdAt = null,
    updatedAt = null,
    comments = []
  ) {
    this.id = id
    this.content = content
    this.user = user
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.comments = comments
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: {
        id: this.user.id,
        cohortId: this.user.cohortId,
        role: this.user.role,
        firstName: this.user.profile.firstName,
        lastName: this.user.profile.lastName,
        bio: this.user.profile.bio,
        githubUrl: this.user.profile.githubUrl,
        username: this.user.profile.username,
        mobile: this.user.profile.mobile,
        specialism: this.user.profile.specialism,
        startDate: this.user.profile.startDate,
        endDate: this.user.profile.endDate,
        profileImage: this.user.profile.profileImage
      },
      comments: this.comments.map((comment) => ({
        id: comment.id,
        content: comment.content
      }))
    }
  }

  static async createPost(content, user) {
    return dbClient.post.create({
      data: { content: content, userId: user.id }
    })
  }

  static async getAllPosts() {
    const posts = await dbClient.post.findMany({
      include: {
        user: {
          include: { profile: true }
        },
        comments: true
      }
    })
    return posts.map(
      (post) =>
        new Post(
          post.id,
          post.content,
          post.user,
          post.createdAt,
          post.updatedAt,
          post.comments
        )
    )
  }

  static async getPostById(id) {
    const post = await dbClient.post.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true }
        },
        comments: true
      }
    })
    return post
      ? new Post(
          post.id,
          post.content,
          post.user,
          post.createdAt,
          post.updatedAt,
          post.comments
        )
      : null
  }

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
