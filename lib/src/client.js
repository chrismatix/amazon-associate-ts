"use strict";
const https = require("https");
const http = require("http");
const url = require("url");
const _ = require("underscore");
const digest_1 = require("./digest");
const unzipping_response_decorator_1 = require("./unzipping-response-decorator");
// simplified request handling
// decorates http api for digest auth, following redirects and unzipping
// just adds functionality
class default_1 {
    constructor(options) {
        this.options = options;
        this.digests = {};
    }
    debug(...args) {
        if (this.options.debug) {
            return console.error('DEBUG: request', ...Array.from(args));
        }
    }
    request(options, cb) {
        if (options.unzip == null) {
            options.unzip = false;
        }
        this.debug('options', options);
        let currentDigest = this.digests[options.host];
        let clonedOptions = _.extend({}, options);
        if (currentDigest != null) {
            if (clonedOptions.headers == null) {
                clonedOptions.headers = {};
            }
            _.extend(clonedOptions.headers, { Authorization: currentDigest });
        }
        let httpOrHttps = options.https ? https : http;
        let req = httpOrHttps.request(clonedOptions, res => {
            this.debug('response status code', res.statusCode);
            this.debug('response headers', res.headers);
            res.on('close', err => this.debug('response error', err));
            let handlers = {};
            handlers[200] = () => {
                if (options.unzip) {
                    return cb(null, new unzipping_response_decorator_1.default(res));
                }
                res.setEncoding('utf-8');
                return cb(null, res);
            };
            handlers[301] = (handlers[302] = () => {
                this.debug('moved', res.headers);
                let { location } = res.headers;
                this.debug('moved to', location);
                let parsedUrl = url.parse(location);
                this.debug('redirect location', parsedUrl);
                return this.request(_.extend({}, parsedUrl, {
                    https: (parsedUrl.protocol === 'https') || parsedUrl.protocol.indexOf('https') !== -1,
                    state: options.state,
                    unzip: options.unzip
                }), cb);
            });
            handlers[401] = () => {
                let msg1 = 'wrong credentials';
                if (currentDigest != null) {
                    return cb(new Error(msg1));
                }
                let msg2 = 'authentication required, but `digest` option is not set';
                let credentials = __guard__(this.options != null ? this.options.credentials : undefined, x => x[options.host]);
                if ((credentials == null)) {
                    return cb(new Error(msg2));
                }
                this.debug('not authorized: authorizing');
                let challenge = digest_1.parseChallenge(res.headers['www-authenticate']);
                this.debug('challenge:', challenge);
                let digest = digest_1.renderDigest(challenge, credentials.username, credentials.password, options.path);
                this.digests[options.host] = digest;
                this.debug('digest:', digest);
                // retry with the digest
                return this.request(_.extend({}, options), cb);
            };
            let handler = handlers[res.statusCode];
            let msg = `failed to get ${options.path}. server status ${res.statusCode}`;
            if ((handler == null)) {
                return cb(new Error(msg));
            }
            return handler();
        });
        return req.end();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
//# sourceMappingURL=client.js.map