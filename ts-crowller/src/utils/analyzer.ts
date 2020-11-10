import cheerio from 'cheerio';
import fs from 'fs';

interface Course {
	title: string
	count: number
}

interface CourseResult {
	time: number
	data: Course[]
}

interface Content {
	[propName: number]: Course[]
}

export default class Analyzer implements Analyzer {
  private static instance: Analyzer

  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }
    return Analyzer.instance
  }

  // 根据html节点获取课程内容
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    const courseInfo: Course[] = [];

    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);

      return courseInfo.push({
        title,
        count,
      });
    });

    return {
      time: new Date().getTime(),
      data: courseInfo,
    };
  }

  // 生成json文件内容
  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    // 判断文件路径对应的文件是否存在
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {
  }
}
