import parse from './xml-parser';

export default (options) => {
    return function* (next) {
        // only set this.request.body when type is xml
        if (this.is('text/xml') || /xml/i.test(this.headers['content-type'])) {
            if (/^(POST|PUT|PATCH)$/i.test(this.method)) {
                this.request.body = yield parse(this.req, options);
            }
        }
        yield next;
    }
};
