import { EventEmitter } from 'events';

import * as _ from 'underscore';
import {SAXParser} from 'sax';

export default class extends EventEmitter {

    items = [];
    mode = 'search-item-list';
    parser: SAXParser;

    constructor() {
        super();

        this.parser = new SAXParser(false, {});
        this.parser.onerror = err => this.emit('error', err);
        this.parser.onend = () => this.emit('end', this.items);

        this.parser.onopentag = ({name, attributes}) => {
            if ((this.mode === 'search-item-list') && (name === 'ITEMS')) { this.mode = 'next-item'; }

            if ((this.mode === 'next-item') && (name === 'ITEM')) {
                let item = {};
                _.each(_.keys(attributes), key => item[key.toLowerCase()] = attributes[key]);
                return this.items.push(item);
            }
        };
    }

    write(data) { return this.parser.write(data); }
    close() { return this.parser.close(); }
};
