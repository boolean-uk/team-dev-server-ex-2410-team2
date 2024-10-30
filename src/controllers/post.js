import { sendDataResponse } from '../utils/responses.js'
import Post from '../domain/post.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  const { content } = req.body
  const user = await User.findById(req.user.id)

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  try {
    const post = await Post.createPost(content, user)
    if (post) {
      return sendDataResponse(res, 201, { post })
    } else {
      return sendDataResponse(res, 500, { content: 'Failed to create post' })
    }
  } catch (error) {
    return sendDataResponse(res, 500, { content: 'Internal server error' })
  }
}

export const getAll = async (req, res) => {
  const posts = await Post.getAllPosts()
  if (!posts) {
    return sendDataResponse(res, 500, {
      content: 'Internal server error'
    })
  }
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.user.id,
      cohortId: post.user.cohortId,
      role: post.user.role,
      firstName: post.user.profile.firstName,
      lastName: post.user.profile.lastName,
      bio: post.user.profile.bio,
      githubUrl: post.user.profile.githubUrl,
      username: post.user.profile.username,
      mobile: post.user.profile.mobile,
      specialism: post.user.profile.specialism,
      startDate: post.user.profile.startDate,
      endDate: post.user.profile.endDate,
      profileImage: post.user.profile.profileImage
    }
  }))
  return sendDataResponse(res, 200, { formattedPosts })
}

export const getById = async (req, res) => {
  const { id } = req.params
  const post = await Post.getPostById(Number(id))

  if (!post) {
    return sendDataResponse(res, 404, {
      content: `Post with id ${id} not found`
    })
  }

  const formattedPost = {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.user.id,
      cohortId: post.user.cohortId,
      role: post.user.role,
      firstName: post.user.profile.firstName,
      lastName: post.user.profile.lastName,
      bio: post.user.profile.bio,
      githubUrl: post.user.profile.githubUrl,
      username: post.user.profile.username,
      mobile: post.user.profile.mobile,
      specialism: post.user.profile.specialism,
      startDate: post.user.profile.startDate,
      endDate: post.user.profile.endDate,
      profileImage: post.user.profile.profileImage
    }
  }

  return sendDataResponse(res, 200, { post: formattedPost })
}

export const updateById = async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {
    const post = await Post.getPostById(Number(id))
    if (post) {
      const updatedPost = await Post.updateContentById(Number(id), content)
      return sendDataResponse(res, 200, { post: updatedPost })
    } else {
      return sendDataResponse(res, 404, {
        content: `Post with id ${id} not found`
      })
    }
  } catch (error) {
    return sendDataResponse(res, 500, {
      content: 'Internal server error'
    })
  }
}

export const deleteById = async (req, res) => {
  const { id } = req.params

  try {
    const post = await Post.getPostById(Number(id))
    if (post) {
      const deletedPost = await Post.deletePostById(Number(id))
      return sendDataResponse(res, 200, { post: deletedPost })
    } else {
      return sendDataResponse(res, 404, {
        content: `Post with id ${id} not found`
      })
    }
  } catch (error) {
    return sendDataResponse(res, 500, {
      content: 'Internal server error'
    })
  }
}
