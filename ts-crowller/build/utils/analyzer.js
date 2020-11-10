"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var Analyzer = /** @class */ (function () {
    function Analyzer() {
    }
    Analyzer.getInstance = function () {
        if (!Analyzer.instance) {
            Analyzer.instance = new Analyzer();
        }
        return Analyzer.instance;
    };
    // 根据html节点获取课程内容
    Analyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var courseItems = $('.course-item');
        var courseInfo = [];
        courseItems.map(function (index, element) {
            var descs = $(element).find('.course-desc');
            var title = descs.eq(0).text();
            var count = parseInt(descs.eq(1).text().split('：')[1], 10);
            return courseInfo.push({
                title: title,
                count: count,
            });
        });
        return {
            time: new Date().getTime(),
            data: courseInfo,
        };
    };
    // 生成json文件内容
    Analyzer.prototype.generateJsonContent = function (courseInfo, filePath) {
        var fileContent = {};
        // 判断文件路径对应的文件是否存在
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    };
    Analyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html);
        var fileContent = this.generateJsonContent(courseInfo, filePath);
        return JSON.stringify(fileContent);
    };
    return Analyzer;
}());
exports.default = Analyzer;
