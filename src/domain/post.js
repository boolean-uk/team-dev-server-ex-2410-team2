import dbClient from '../utils/dbClient.js'

export class Post {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      post: {
        id: this.id
      }
    }
  }
}

export async function getPostById(id) {
  try {
    const post = await dbClient.post.findUnique({
      where: { id: id }
    })
    return post
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }
}

export async function updateContentById(id, content) {
  try {
    const post = await dbClient.post.update({
      where: { id: id },
      data: { content: content }
    })
    return post
  } catch (error) {
    console.error('Error updating post content by ID:', error)
    return null
  }
}
