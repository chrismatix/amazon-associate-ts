"use strict";
const _ = require("underscore");
const moment = require("moment");
const client_1 = require("./client");
const item_parser_1 = require("./item-parser");
const report_parser_1 = require("./report-parser");
let parseResponse = function (res, parser, cb) {
    parser.on('error', err => cb(err));
    parser.on('end', result => cb(null, result));
    res.on('error', err => cb(err));
    res.on('data', data => parser.write(data));
    return res.on('end', () => parser.close());
};
class Amazon {
    debug(...args) {
        if (this.options.debug) {
            return console.error('amazon-associate:', ...Array.from(args));
        }
    }
    constructor(options) {
        this.options = options;
        if ((this.options.associateId == null)) {
            throw new Error('missing associateId option');
        }
        if ((this.options.password == null)) {
            throw new Error('missing password option');
        }
        _.defaults(this.options, {
            host: 'assoc-datafeeds-eu.amazon.com',
            reportPath: '/datafeed/listReports',
            debug: false
        });
        let clientOptions = {
            debug: this.options.debug,
            credentials: {}
        };
        clientOptions.credentials[this.options.host] = {
            type: 'digest',
            username: this.options.associateId,
            password: this.options.password
        };
        this.client = new client_1.default(clientOptions);
    }
    getReportUrl(date, type) {
        let datestring = moment(date).format('YYYYMMDD');
        let filename = `${this.options.associateId}-${type}-report-${datestring}.xml.gz`;
        return `/datafeed/getReport?filename=${filename}`;
    }
    _getItems(date, type, cb) {
        return this.client.request({
            https: true,
            host: this.options.host,
            path: this.getReportUrl(date, type),
            unzip: true
        }, function (err, res) {
            if (err != null) {
                return cb(err);
            }
            let datestring = moment(date).format('YYYY-MM-DD');
            if (res.headers['content-length'] === '0') {
                return cb(new Error(`no ${type} for date ${datestring}`));
            }
            let parser = new item_parser_1.default;
            return parseResponse(res, parser, cb);
        });
    }
    getOrders(date, cb) {
        return this._getItems(date, 'orders', cb);
    }
    getEarnings(date, cb) {
        return this._getItems(date, 'earnings', cb);
    }
    getReports(cb) {
        return this.client.request({
            https: true,
            host: this.options.host,
            path: this.options.reportPath,
            unzip: false
        }, function (err, res) {
            if (err != null) {
                return cb(err);
            }
            let parser = new report_parser_1.default;
            return parseResponse(res, parser, cb);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Amazon;
//# sourceMappingURL=amazon.js.map