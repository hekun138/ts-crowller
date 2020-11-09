import {Request, Response, Router} from "express";
import Crowller from "./crowller";
import DellAnalyzer from './dellAnalyzer';

// 问题1：express 库的类型定义文件，.d.ts 文件类型描述不准确
interface RequestWithBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <body>
        <form method="post" action="/getData">
          <input type="password" name="password"/>
          <button>提交</button>
        </form>
      </body>
    </html>
  `)
})

router.post('/getData', (req: RequestWithBody, res: Response) => {
  const { password } = req.body
  if (password === '123') {
    const secret = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData success')
  } else {
    res.send('password Error!')
  }

})


export default router
