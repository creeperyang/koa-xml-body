import { parseString } from 'xml2js';
import raw from 'raw-body';

const convertXml2Json = (...args/*str, options*/) => {
    return new Promise((resolve, reject) => {
        const cb = (err, result) => {
            err ? reject(err) : resolve(result);
        };
        parseString(...args, cb);
    });
};

const parse = (request, options = { limit: '1mb' }) => {
    let len = request.headers['content-length'];
    let charset = /;\s*charset\s*=\s*(\S+)\s*/i.exec(request.headers['content-type']);
    // set options
    if (len) {
        options.length = len = ~~len;
    }
    options.encoding = (charset && charset[1]) || options.encoding || 'utf8';

    return raw(request, options)
        .then((str) => {
            return convertXml2Json(str);
        });
};

export default parse;
