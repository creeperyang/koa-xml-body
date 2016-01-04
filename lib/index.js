import parse from './xml-parser';

const onerror = () => {};

export default (options = { onerror }) => {
    return function* (next) {
        /**
         * only parse and set this.request.body when
         * 1. type is xml (text/xml and application/xml)
         * 2. method is post/put/patch
         * 3. this.request.body is undefined
         */
        if (this.request.body === undefined && this.is('text/xml', 'xml') && /^(POST|PUT|PATCH)$/i.test(this.method)) {
            if (!options.encoding && this.request.charset) {
                options.encoding = this.request.charset;
            }
            try {
                this.request.body = yield parse(this.req, options);
            } catch (err) {
                // if want to throw error, set onerror to null
                if (options.onerror) {
                    options.onerror(err, this);
                } else {
                    throw err;
                }
            }
        }
        yield next;
    };
};
