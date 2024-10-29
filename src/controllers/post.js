import { sendDataResponse } from '../utils/responses.js'
import { getPostById, updateContentById } from '../domain/post.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
}

export const getAll = async (req, res) => {
  return sendDataResponse(res, 200, {
    posts: [
      {
        id: 1,
        content: 'Hello world!',
        author: { ...req.user }
      },
      {
        id: 2,
        content: 'Hello from the void!',
        author: { ...req.user }
      }
    ]
  })
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
