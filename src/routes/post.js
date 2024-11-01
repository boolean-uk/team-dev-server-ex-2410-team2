import { Router } from 'express'
import {
  create,
  getAll,
  updateById,
  getById,
  deleteById,
  likePost,
  unlikePost
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import {
  validatePostOwnership,
  validatePostContent,
  validatePostExists
} from '../middleware/post.js'

const router = Router()

router.post('/', validateAuthentication, validatePostContent, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch(
  '/:id',
  validateAuthentication,
  validatePostOwnership,
  validatePostContent,
  updateById
)
router.delete('/:id', validateAuthentication, validatePostOwnership, deleteById)
router.post('/:id/like', validateAuthentication, validatePostExists, likePost)
router.post(
  '/:id/unlike',
  validateAuthentication,
  validatePostExists,
  unlikePost
)

export default router
