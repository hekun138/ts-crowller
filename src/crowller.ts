// ts -> .d.ts 翻译文件 -> js
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import cheerio from 'cheerio'

interface Course {
	title: string,
	count: number
}

interface CourseResult {
	time: number,
	data: Course[]
}

interface Content {
	[propName: number]: Course[]
}

class Crowller {
	private secret = 'x3b174jsx'
	private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
	// 根据html节点获取课程内容
	getCourseInfo(html: string) {
		const $ = cheerio.load(html)
		const courseItems = $('.course-item')
		const courseInfo: Course[] = []

		courseItems.map((index, element) => {
			const descs = $(element).find('.course-desc')
			const title = descs.eq(0).text()
			const count = parseInt(descs.eq(1).text().split('：')[1])

			courseInfo.push({
				title,
				count,
			})
		})
		return {
			time: new Date().getTime(),
			data: courseInfo,
		}
	}
	// 生成html内容
	async getRawHtml() {
		const result = await superagent.get(this.url)
		return result.text
	}
	// 生成json文件内容
	generateJsonContent(courseInfo: CourseResult) {
		const filePath = path.resolve(__dirname, '../data/course.json')
		let fileContent: Content = {}
		// // 判断文件路径对应的文件是否存在
		if (fs.existsSync(filePath)) {
			fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
		}
		fileContent[courseInfo.time] = courseInfo.data
		fs.writeFileSync(filePath, JSON.stringify(fileContent))
	}
	// 爬虫内容
	async initSpiderProcess() {
		const html = await this.getRawHtml()
		const courseInfo = this.getCourseInfo(html)
		this.generateJsonContent(courseInfo)
	}

	constructor() {
		this.initSpiderProcess()
	}
}

const crowller = new Crowller()
