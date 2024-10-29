import { Router } from 'express'
import {
  create,
  getAll,
  updateById,
  getById,
  deleteById
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, updateById)
router.delete('/:id', validateAuthentication, deleteById)

export default router
