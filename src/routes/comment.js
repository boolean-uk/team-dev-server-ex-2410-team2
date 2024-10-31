import { Router } from 'express'
import { create, remove, update } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.patch('/:id', validateAuthentication, update)
router.delete('/:id', validateAuthentication, remove)

export default router
