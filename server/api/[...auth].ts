import { serverAuth } from '../utils/auth'

export default eventHandler(event => serverAuth().handler(toWebRequest(event)))
