import dbClient from '../utils/dbClient.js'

export default class Post {
  constructor(
    id = null,
    content = '',
    user = null,
    createdAt = null,
    updatedAt = null,
    comments = [],
    likedBy = []
  ) {
    this.id = id
    this.content = content
    this.user = user
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.comments = comments
    this.likedBy = likedBy
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
      })),
      likedBy: this.likedBy.map((user) => ({
        id: user.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email
      }))
    }
  }

  static async createPost(content, user) {
    const post = await dbClient.post.create({
      data: { content: content, userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            cohortId: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                bio: true,
                githubUrl: true,
                username: true,
                mobile: true,
                specialism: true,
                startDate: true,
                endDate: true
              }
            }
          }
        }
      }
    })

    return post
  }

  static async getAllPosts() {
    const posts = await dbClient.post.findMany({
      include: {
        user: {
          include: { profile: true }
        },
        likedBy: {
          include: { profile: true }
        },
        comments: true
      }
    })
    const returnPosts = posts.map(
      (post) =>
        new Post(
          post.id,
          post.content,
          post.user,
          post.createdAt,
          post.updatedAt,
          post.comments,
          post.likedBy
        )
    )
    const sortedPosts = returnPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    return sortedPosts
  }

  static async getPostById(id) {
    const post = await dbClient.post.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true }
        },
        likedBy: {
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
          post.comments,
          post.likedBy
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

  static async likePost(postId, userId) {
    const updatedPost = await dbClient.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          connect: { id: userId }
        }
      },
      include: {
        user: {
          include: { profile: true }
        },
        likedBy: {
          include: { profile: true }
        },
        comments: true
      }
    })
    return new Post(
      updatedPost.id,
      updatedPost.content,
      updatedPost.user,
      updatedPost.createdAt,
      updatedPost.updatedAt,
      updatedPost.comments,
      updatedPost.likedBy
    )
  }

  static async unlikePost(postId, userId) {
    const updatedPost = await dbClient.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          disconnect: { id: userId }
        }
      },
      include: {
        user: {
          include: { profile: true }
        },
        likedBy: {
          include: { profile: true }
        },
        comments: true
      }
    })
    return new Post(
      updatedPost.id,
      updatedPost.content,
      updatedPost.user,
      updatedPost.createdAt,
      updatedPost.updatedAt,
      updatedPost.comments,
      updatedPost.likedBy
    )
  }
}
