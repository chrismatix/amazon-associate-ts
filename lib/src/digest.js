"use strict";
const crypto = require("crypto");
const _ = require("underscore");
let md5 = function (string) {
    let hash = crypto.createHash('md5');
    hash.update(string);
    return hash.digest('hex');
};
let digest;
function parseChallenge(challenge) {
    // header is something like this:
    // Digest realm="DataFeeds", qop="auth", nonce="69e3391d503ae9fd43e9b5202390d15a", opaque="0753652c1f86cb100ec28975b6a72fbf"
    let obj = {};
    _.each(challenge.substring(7).split(/,\s+/), function (part) {
        let [key, valueInQuotes] = Array.from(part.split('='));
        return obj[key] = valueInQuotes.replace(/"/g, '');
    });
    return obj;
}
exports.parseChallenge = parseChallenge;
function renderResponse(challenge, username, password, path) {
    let h1 = md5([username, challenge.realm, password].join(':'));
    let h2 = md5(['GET', path].join(':'));
    return md5([h1, challenge.nonce, '000001', '', 'auth', h2].join(':'));
}
function renderDigest(challenge, username, password, path) {
    let params = {
        username,
        realm: challenge.realm,
        nonce: challenge.nonce,
        uri: path,
        qop: challenge.qop,
        response: renderResponse(challenge, username, password, path),
        nc: '000001',
        cnonce: '',
        opaque: challenge.opaque
    };
    let parts = _.map(_.keys(params), key => `${key}=\"${params[key]}\"`);
    return `Digest ${parts.join(', ')}`;
}
exports.renderDigest = renderDigest;
//# sourceMappingURL=digest.js.map