"use strict";
const report_parser_1 = require("../src/report-parser");
const fs = require("fs");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'empty reports are parsed correctly'(test) {
        let parser = new report_parser_1.default;
        parser.on('error', () => test.fail());
        parser.on('end', function (reports) {
            test.deepEqual(reports, []);
            return test.done();
        });
        parser.write(fs.readFileSync('./test/report1.html'));
        return parser.close();
    },
    'a single report is parsed correctly'(test) {
        let parser = new report_parser_1.default;
        parser.on('error', () => test.fail());
        parser.on('end', function (reports) {
            test.deepEqual(reports, [
                {
                    filename: 'gynny-21-earnings-report-20120506.tsv.gz',
                    lastModified: 'Thu Jun 07 14:42:40 GMT 2012',
                    md5: '"9e65e79b66679c779ff322a658c479df"',
                    size: '186',
                    url: 'getReport?filename=gynny-21-earnings-report-20120506.tsv.gz'
                }
            ]);
            return test.done();
        });
        parser.write(fs.readFileSync('./test/report2.html'));
        return parser.close();
    },
    'three reports are parsed correctly'(test) {
        let parser = new report_parser_1.default;
        parser.on('error', () => test.fail());
        parser.on('end', function (reports) {
            test.deepEqual(reports, [
                {
                    filename: 'gynny-21-earnings-report-20120506.tsv.gz',
                    lastModified: 'Thu Jun 07 14:42:40 GMT 2012',
                    md5: '"9e65e79b66679c779ff322a658c479df"',
                    size: '186',
                    url: 'getReport?filename=gynny-21-earnings-report-20120506.tsv.gz'
                },
                {
                    filename: 'gynny-21-earnings-report-20120506.xml.gz',
                    lastModified: 'Thu Jun 07 14:42:35 GMT 2012',
                    md5: '"f317a5689822bd67c72e133f39f431ee"',
                    size: '823',
                    url: 'getReport?filename=gynny-21-earnings-report-20120506.xml.gz'
                },
                {
                    filename: 'gynny-21-earnings-report-20120507.tsv.gz',
                    lastModified: 'Thu Jun 07 14:42:30 GMT 2012',
                    md5: '"0cba75d3edb2fd4e9c14696166de322b"',
                    size: '186',
                    url: 'getReport?filename=gynny-21-earnings-report-20120507.tsv.gz'
                }
            ]);
            return test.done();
        });
        parser.write(fs.readFileSync('./test/report3.html'));
        return parser.close();
    }
};
//# sourceMappingURL=report-parser.js.map