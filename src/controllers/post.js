import { sendDataResponse } from '../utils/responses.js'
import { getAllPosts, getPostById, updateContentById } from '../domain/post.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
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
