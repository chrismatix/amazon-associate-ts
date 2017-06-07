import {EventEmitter} from 'events';

import {SAXParser} from 'sax';

export default class extends EventEmitter {

    reports = [];
    report: {
        filename?: string,
        lastModified?: string,
        md5?: string,
        size?: string,
        url?: string
    };
    mode = 'search-table-head-end';
    parser: SAXParser;

    constructor() {
        super();

        this.report = {};
        this.parser = new SAXParser(false, {});
        this.parser.onerror = err => this.emit('error', err);
        this.parser.onend = () => this.emit('end', this.reports);

        this.parser.onopentag = ({name}) => {
            if ((this.mode === 'next-row') && (name === 'TR')) {
                return this.mode = 'read-filename';
            }
        };

        this.parser.ontext = text => {
            switch (this.mode) {
                case 'read-filename':
                    this.report.filename = text;
                    return this.mode = 'read-last-modified';
                case 'read-last-modified':
                    this.report.lastModified = text;
                    return this.mode = 'read-md5';
                case 'read-md5':
                    this.report.md5 = text;
                    return this.mode = 'read-size';
                case 'read-size':
                    this.report.size = text;
                    return this.mode = 'read-url';
            }
        };

        this.parser.onattribute = ({name, value}) => {
            if ((this.mode === 'read-url') && (name === 'HREF')) {
                this.report.url = value;
                this.reports.push(this.report);
                this.report = {};
                return this.mode = 'next-row';
            }
        };

        this.parser.onclosetag = name => {
            if ((this.mode === 'search-table-head-end') && (name === 'TR')) {
                return this.mode = 'next-row';
            }
        };
    }

    write(data) {
        return this.parser.write(data);
    }

    close() {
        return this.parser.close();
    }
};
