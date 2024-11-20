import { defineEventHandler, toWebRequest } from '#imports'
import { serverAuth } from '../utils/auth'

export default defineEventHandler(event => serverAuth().handler(toWebRequest(event)))
