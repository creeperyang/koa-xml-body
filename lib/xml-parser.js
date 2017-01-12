import { parseString } from 'xml2js';
import raw from 'raw-body';

const convertXml2Json = (...args/* str, options */) => {
    return new Promise((resolve, reject) => {
        const cb = (err, result) => {
            err ? reject(err) : resolve(result);
        };
        parseString(...args, cb);
    });
};

const parse = (request, { limit = '1mb', encoding = 'utf8', length, xmlOptions } = {}) => {
    let len = request.headers['content-length'];
    // set options
    if (len) {
        length = len = ~~len;
    }
    return raw(request, { limit, encoding, length })
        .then((str) => {
            return convertXml2Json(str, xmlOptions || {}).catch((err) => {
                err = typeof err === 'string' ? new Error(err) : err;
                err.status = 400;
                err.body = str;
                throw err;
            });
        }).catch((err) => {
            throw err;
        });
};

export default parse;
