import { Router } from 'express'
import {
  create,
  getAll,
  updateById,
  getById,
  deleteById
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

import {
  validatePostOwnership,
  validatePostContent
} from '../middleware/post.js'

const router = Router()

router.post('/', validateAuthentication, validatePostContent, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validatePostOwnership, updateById)
router.delete('/:id', validateAuthentication, validatePostOwnership, deleteById)

export default router
