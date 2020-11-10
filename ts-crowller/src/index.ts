import express, {NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'
import router from './router'
import cookieSession from 'cookie-session'

// 问题2：当我使用中间件的时候，对 req 或者 res 做了修改之后，实际上类型并不能改变
const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher dell'],
    maxAge: 24 * 60 * 60 * 1000
  })
)
app.use(router)

app.listen(7001, () => {
  console.log('serve is running')
})
