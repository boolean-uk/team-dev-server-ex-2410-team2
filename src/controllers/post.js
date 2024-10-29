import { sendDataResponse } from '../utils/responses.js'
import {
  createPost,
  getAllPosts,
  getPostById,
  updateContentById,
  deletePostById
} from '../domain/post.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  const { content, userid } = req.body
  const user = await User.findById(userid)

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  try {
    const post = await createPost(content, user)
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
  const posts = await getAllPosts()
  if (!posts) {
    return sendDataResponse(res, 500, {
      content: 'Internal server error'
    })
  }
  return sendDataResponse(res, 200, { posts })
}

export const getById = async (req, res) => {
  const { id } = req.params
  const post = await getPostById(Number(id))

  if (!post) {
    return sendDataResponse(res, 404, {
      content: `Post with id ${id} not found`
    })
  }

  return sendDataResponse(res, 200, { post })
}

export const updateById = async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {
    const post = await getPostById(Number(id))
    if (post) {
      const updatedPost = await updateContentById(Number(id), content)
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
    const post = await getPostById(Number(id))
    if (post) {
      const deletedPost = await deletePostById(Number(id))
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
