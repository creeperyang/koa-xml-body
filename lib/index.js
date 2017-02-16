'use strict'

const parse = require('./xml-parser')

module.exports = function koaXmlBody(options) {
    if (typeof options !== 'object') {
        options = {}
    }
    return function plugin(ctx, next) {
        /**
         * only parse and set ctx.request.body when
         * 1. type is xml (text/xml and application/xml)
         * 2. method is post/put/patch
         * 3. ctx.request.body is undefined
         */
        if (
            ctx.request.body === undefined &&
            ctx.is('text/xml', 'xml') &&
            /^(POST|PUT|PATCH)$/i.test(ctx.method)
        ) {
            if (!options.encoding && ctx.request.charset) {
                options.encoding = ctx.request.charset
            }
            return parse(ctx.req, options).then(data => {
                ctx.request.body = data
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
