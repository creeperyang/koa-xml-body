'use strict'

const parseString = require('xml2js').parseString
const raw = require('raw-body')

module.exports = parse

function convertXml2Json(str, options) {
    return new Promise((resolve, reject) => {
        parseString(str, options, (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

function parse(request, options) {
    options = Object.assign({
        limit: '1mb',
        encoding: 'utf8',
        xmlOptions: {}
    }, options)
    const len = request.headers['content-length']
    if (len) {
        options.length = len
    }
    return raw(request, options)
        .then(async (str) => {
            const xml = await convertXml2Json(str, options.xmlOptions).catch(err => {
                err = typeof err === 'string' ? new Error(err) : err
                err.status = 400
                err.body = str
                throw err
            });
            return {
                xml,
                rawBody: str,
            }
        })
}
