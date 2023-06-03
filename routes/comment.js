import {Router} from 'express'
import { checkAuth } from "../middlewares/checkAuth.js";
import {createComment} from '../controller/comment.js'

const router = new Router()

router.post('/:id', checkAuth, createComment)

export default router