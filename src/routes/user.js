import { Router } from 'express'
import { create, getById, getAll, updateById } from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole,
  validateLoggedInUser
} from '../middleware/auth.js'
import { validateUser } from '../middleware/user.js'

const router = Router()

router.post('/', validateUser, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch(
  '/:id',
  validateAuthentication,
  validateUser,
  validateLoggedInUser,
  validateTeacherRole,
  updateById
)

export default router
