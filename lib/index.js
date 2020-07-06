'use strict'

const parse = require('./xml-parser')

module.exports = function koaXmlBody(options) {
    if (typeof options !== 'object') {
        options = {}
    }
    const bodyKey = options.key || 'body'
    return function plugin(ctx, next) {
        /**
         * only parse and set ctx.request[bodyKey] when
         * 1. type is xml (text/xml and application/xml)
         * 2. method is post/put/patch
         * 3. ctx.request[bodyKey] is undefined
         */
        if (
            ctx.request[bodyKey] === undefined &&
            ctx.is('text/xml', 'xml') &&
            /^(POST|PUT|PATCH)$/i.test(ctx.method)
        ) {
            if (!options.encoding && ctx.request.charset) {
                options.encoding = ctx.request.charset
            }
            return parse(ctx.req, options).then(result => {
                ctx.request[bodyKey] = result.jsonData
                ctx.request.rawBody = result.rawBody
                return next()
            }).catch(err => {
                if (options.onerror) {
                    options.onerror(err, ctx)
                }
                // throw error by default
                else {
                    throw err
                }
            })
        }
        return next()
    }
}
