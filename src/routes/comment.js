import { Router } from 'express'
import { create, remove, update } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.patch('/:commentid', validateAuthentication, update)
router.delete('/:commentid', validateAuthentication, remove)

export default router
