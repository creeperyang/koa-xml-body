import request from 'supertest';
import koa from 'koa';
import should from 'should';
import iconv from 'iconv-lite';
import parseXMLBody from '../';

const expected = {
    xml: {
        Content: ['Hello,世界！'],
        CreateTime: ['12345678'],
        FromUserName: ['DG'],
        MsgType: ['text'],
        ToUserName: ['Little Cat']
    }
};

const sourceXml = `<xml>
    <ToUserName>Little Cat</ToUserName>
    <FromUserName>DG</FromUserName>
    <CreateTime>12345678</CreateTime>
    <MsgType>text</MsgType>
    <Content>Hello,世界！</Content>
    </xml>`;

describe('koa-xml-body', () => {
    describe('with a valid xml body', () => {
        it('should parse body when type is text/xml', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                this.request.body.should.eql(expected);
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml)
                .expect(200, done);
        });

        it('should parse body when type is application/xml', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                this.request.body.should.eql(expected);
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done);
        });

        it('should parse body when charset/encoding is gb2312', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                this.request.body.should.eql(expected);
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml;charset=gb2312')
                .send(iconv.encode(sourceXml, 'gb2312'))
                .expect(200, done);
        });

        it('should parse body when charset/encoding is big5', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                this.request.body.should.eql(expected);
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml;charset=big5')
                .send(iconv.encode(sourceXml, 'big5'))
                .expect(200, done);
        });

        it('should skip (wont parse) when ctx.request.body exists', (done) => {
            let app = koa();

            app.use(function* (next) {
                this.request.body = 'hi';
                yield next;
            });

            app.use(parseXMLBody());

            app.use(function* () {
                this.request.body.should.eql('hi');
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done);
        });

        it('should skip (wont parse) when GET', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                should.not.exist(this.request.body);
                this.status = 200;
            });

            request(app.listen())
                .get('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done);
        });

        it('should respond 413 when limit is less than content-length', (done) => {
            let app = koa();

            app.use(parseXMLBody({
                limit: 128,
                onerror: (err, ctx) => {
                    ctx.throw(err.status, err.message);
                }
            }));

            app.use(function* () {
                should.not.exist(this.request.body);
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(413, 'request entity too large')
                .end(done);
        });
    });

    describe('with a valid xml body and addtional xmlOptions', () => {
        it('should parse body correctly when xmlOptions.explicitArray is false', (done) => {
            let app = koa();

            app.use(parseXMLBody({
                xmlOptions: { explicitArray: false }
            }));

            app.use(function* () {
                this.request.body.should.eql({
                    xml: {
                        Content: 'Hello,世界！',
                        CreateTime: '12345678',
                        FromUserName: 'DG',
                        MsgType: 'text',
                        ToUserName: 'Little Cat'
                    }
                });
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml)
                .expect(200, done);
        });
    });

    describe('with an invalid body', () => {
        it('should respond 400', (done) => {
            let app = koa();

            app.use(parseXMLBody({
                onerror: (err, ctx) => {
                    ctx.throw(err.status, err.message);
                }
            }));

            app.use(function* () {
                should.not.exist(this.request.body);
            });

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml.slice(0, -1))
                .expect(400, done);
        });
    });

    describe('with an empty body', () => {
        it('should not throw when GET', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                should.not.exist(this.request.body);
                this.status = 200;
            });

            request(app.listen())
                .get('/')
                .expect(200, done);
        });

        it('should not throw with POST by default', (done) => {
            let app = koa();

            app.use(parseXMLBody());

            app.use(function* () {
                should.not.exist(this.request.body);
                this.status = 200;
            });

            request(app.listen())
                .post('/')
                .expect(200, done);
        });
    });
});
