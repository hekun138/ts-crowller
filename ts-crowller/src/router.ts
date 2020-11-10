import { getResponseData } from "./utils/util";
import {NextFunction, Request, Response, Router} from "express";
import Crowller from "./utils/crowller";
import Analyzer from './utils/analyzer';
import fs from 'fs'
import path from 'path'

// 问题1：express 库的类型定义文件，.d.ts 文件类型描述不准确
interface BodyRequest extends Request{
  body: { [key: string]: string | undefined }
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}

const router = Router()

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    res.send(`
      <html>
        <body>
          <a href="/getData">爬取内容</a>
          <a href="/showData">展示内容</a>
          <a href="/logout">退出</a>
        </body>
      </html>
    `)
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password"/>
            <button>登录</button>
          </form>
        </body>
      </html>
    `)
  }
})

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    res.json(getResponseData(false, '已经登录过'))
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      res.json(getResponseData(true))
    } else {
      res.json(getResponseData(false, '登录失败'))
    }
  }
})

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined
  }
  res.json(getResponseData(true))
})

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const secret = 'x3b174jsx';
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

  const analyzer = Analyzer.getInstance();
  new Crowller(url, analyzer);
  res.json(getResponseData(true))
})

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/course.json')
    const result = fs.readFileSync(position, 'utf-8')
    res.json(getResponseData(JSON.parse(result)))
  } catch (e) {
    res.json(getResponseData(false, '数据不存在'))
  }
})


export default router
