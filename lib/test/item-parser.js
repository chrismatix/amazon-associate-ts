"use strict";
const item_parser_1 = require("../src/item-parser");
const fs = require("fs");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'empty items are parsed correctly'(test) {
        let parser = new item_parser_1.default;
        parser.on('error', err => test.fail());
        parser.on('end', function (earnings) {
            test.deepEqual(earnings, []);
            return test.done();
        });
        const xml = fs.readFileSync('./test/item1.xml');
        parser.write(xml);
        return parser.close();
    },
    'one item is parsed correctly'(test) {
        const parser = new item_parser_1.default;
        parser.on('error', err => test.fail());
        parser.on('end', function (earnings) {
            test.deepEqual(earnings, [
                {
                    asin: '0060527307',
                    category: '14',
                    date: 'July 07, 2008',
                    edate: '1215414000',
                    earnings: '0.60',
                    linktype: 'asn',
                    price: '7.99',
                    qty: '1',
                    rate: '7.51',
                    revenue: '7.99',
                    seller: 'Amazon.com',
                    tag: 'cse-ce- 20',
                    subtag: '92164|1|ma',
                    title: 'Double Shot (Goldy Culinary Mysteries, Book 12)'
                }
            ]);
            return test.done();
        });
        const xml = fs.readFileSync('./test/item2.xml');
        parser.write(xml);
        return parser.close();
    },
    'three items are parsed correctly'(test) {
        let parser = new item_parser_1.default;
        parser.on('error', function (err) {
            console.log(err);
            return test.fail();
        });
        parser.on('end', function (earnings) {
            let expected = [
                {
                    asin: '0060527307',
                    category: '14',
                    date: 'July 07, 2008',
                    edate: '1215414000',
                    earnings: '0.60',
                    linktype: 'asn',
                    price: '7.99',
                    qty: '1',
                    rate: '7.51',
                    revenue: '7.99',
                    seller: 'Amazon.com',
                    tag: 'cse-ce- 20',
                    subtag: '92164|1|ma',
                    title: 'Double Shot (Goldy Culinary Mysteries, Book 12)'
                },
                {
                    asin: '0060527323',
                    category: '14',
                    date: 'July 07, 2008',
                    edate: '1215414000',
                    earnings: '0.60',
                    linktype: 'asn',
                    price: '7.99',
                    qty: '1',
                    rate: '7.51',
                    revenue: '7.99',
                    seller: 'Amazon.com',
                    tag: 'cse-ce- 20',
                    subtag: '92165|3|mb',
                    title: 'Dark Tort (Goldy Culinary Mysteries, Book 13)'
                },
                {
                    asin: '0060723939',
                    category: '14',
                    date: 'July 07, 2008',
                    edate: '1215414000',
                    earnings: '1.12',
                    linktype: 'asn',
                    price: '14.93',
                    qty: '1',
                    rate: '7.50',
                    revenue: '14.93',
                    seller: 'Amazon.com',
                    tag: 'cse- ce-20',
                    subtag: '92166|3|mc',
                    title: 'Crooked Little Vein: A Novel'
                }
            ];
            test.deepEqual(earnings, expected);
            return test.done();
        });
        let xml = fs.readFileSync('./test/item3.xml');
        parser.write(xml);
        return parser.close();
    }
};
//# sourceMappingURL=item-parser.js.map