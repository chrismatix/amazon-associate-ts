"use strict";
const events_1 = require("events");
const _ = require("underscore");
const sax_1 = require("sax");
class default_1 extends events_1.EventEmitter {
    constructor() {
        super();
        this.items = [];
        this.mode = 'search-item-list';
        this.parser = new sax_1.SAXParser(false, {});
        this.parser.onerror = err => this.emit('error', err);
        this.parser.onend = () => this.emit('end', this.items);
        this.parser.onopentag = ({ name, attributes }) => {
            if ((this.mode === 'search-item-list') && (name === 'ITEMS')) {
                this.mode = 'next-item';
            }
            if ((this.mode === 'next-item') && (name === 'ITEM')) {
                let item = {};
                _.each(_.keys(attributes), key => item[key.toLowerCase()] = attributes[key]);
                return this.items.push(item);
            }
        };
    }
    write(data) { return this.parser.write(data); }
    close() { return this.parser.close(); }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=item-parser.js.map