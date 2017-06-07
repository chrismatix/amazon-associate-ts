"use strict";
const events_1 = require("events");
const zlib = require("zlib");
// decorate a response to unzip data on the fly
class default_1 extends events_1.EventEmitter {
    constructor(res) {
        super();
        this.statusCode = res.statusCode;
        this.httpVersion = res.httpVersion;
        this.headers = res.headers;
        this.trailers = res.trailers;
        let gunzip = zlib.createUnzip();
        res.on('data', data => gunzip.write(data));
        res.on('end', () => gunzip.end());
        res.on('close', err => this.emit('close', err));
        gunzip.on('data', data => this.emit('data', data.toString()));
        gunzip.on('error', err => this.emit('close', err));
        gunzip.on('end', () => this.emit('end'));
        this.res = res;
    }
    setEncoding(encoding) { return this.res.setEncoding(encoding); }
    pause() { return this.res.pause(); }
    resume() { return this.res.resume(); }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=unzipping-response-decorator.js.map