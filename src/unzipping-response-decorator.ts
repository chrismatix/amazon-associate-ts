import { EventEmitter } from 'events';
import * as zlib from 'zlib';

import {IncomingMessage} from 'http';

// decorate a response to unzip data on the fly

export default class extends EventEmitter {

    statusCode: number;
    httpVersion: string;
    headers;
    trailers;
    res: IncomingMessage;

    constructor(res: IncomingMessage) {
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
};
