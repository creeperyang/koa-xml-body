'use strict'

const request = require('supertest')
const Koa = require('koa')
const should = require('should')
const iconv = require('iconv-lite')
const parseXMLBody = require('../lib')

describe('koa-xml-body', () => {
    const expected = {
        xml: {
            Content: ['Hello,世界！'],
            CreateTime: ['12345678'],
            FromUserName: ['DG'],
            MsgType: ['text'],
            ToUserName: ['Little Cat']
        }
    }

    const sourceXml = `<xml>
        <ToUserName>Little Cat</ToUserName>
        <FromUserName>DG</FromUserName>
        <CreateTime>12345678</CreateTime>
        <MsgType>text</MsgType>
        <Content>Hello,世界！</Content>
        </xml>`

    function createApp(testMiddleware, preMiddleware, options) {
        const app = new Koa()

        if (preMiddleware) {
            app.use(preMiddleware)
        }

        app.use(parseXMLBody(options))

        app.use(testMiddleware || function(ctx, next) {
            ctx.request.body.should.eql(expected)
            ctx.status = 200
            return next()
        })
        return app
    }

    describe('with a valid xml body', () => {
        it('should parse body when type is text/xml', done => {
            const app = createApp()

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should parse body when type is application/xml', done => {
            const app = createApp()

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should parse body when charset/encoding is gb2312', done => {
            const app = createApp()

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml;charset=gb2312')
                .send(iconv.encode(sourceXml, 'gb2312'))
                .expect(200, done)
        })

        it('should parse body when charset/encoding is big5', done => {
            const app = createApp()

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml;charset=big5')
                .send(iconv.encode(sourceXml, 'big5'))
                .expect(200, done)
        })

        it('should skip (wont parse) when ctx.request.body exists', done => {
            const app = createApp(function(ctx, next) {
                ctx.request.body.should.eql('hi')
                ctx.status = 200
                return next()
            }, function(ctx, next) {
                ctx.request.body = 'hi'
                return next()
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should skip (wont parse) when GET', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                ctx.status = 200
                return next()
            })

            request(app.listen())
                .get('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should skip (wont parse) when HEAD', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                ctx.status = 200
                return next()
            })

            request(app.listen())
                .head('/')
                .expect(200, done)
        })

        it('should skip (wont parse) when type is not xml', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                ctx.status = 200
                return next()
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'plain/text')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should respond 413 when limit is less than content-length', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                return next()
            }, undefined, {
                limit: 128,
                onerror: (err, ctx) => {
                    ctx.throw(err.status, err.message)
                }
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(413, 'request entity too large', done)
        })

        it('should parse body correctly when xmlOptions.explicitArray is false', done => {
            const app = createApp(function(ctx, next) {
                ctx.request.body.should.eql({
                    xml: {
                        Content: 'Hello,世界！',
                        CreateTime: '12345678',
                        FromUserName: 'DG',
                        MsgType: 'text',
                        ToUserName: 'Little Cat'
                    }
                })
                ctx.status = 200
                return next()
            }, undefined, {
                xmlOptions: { explicitArray: false }
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml)
                .expect(200, done)
        })

        it('should work correctly with options.key', done => {
            const app = createApp(function(ctx, next) {
                ctx.request.body.should.eql({})
                ctx.request.xmlBody.should.eql(expected)
                ctx.status = 200
                return next()
            }, function(ctx, next) {
                ctx.request.body = {}
                return next()
            }, {
                key: 'xmlBody'
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'application/xml')
                .send(sourceXml)
                .expect(200, done)
        })
    })

    describe('with an invalid body', () => {
        it('should respond 400', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                return next()
            }, undefined, {
                onerror: (err, ctx) => {
                    ctx.throw(err.status, err.message)
                }
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml.slice(0, -1))
                .expect(400, done)
        })

        it('should output error info by default', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                return next()
            }, undefined)

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .send(sourceXml.slice(0, -1))
                .expect(400, done)
        })
    })

    describe('with an empty body', () => {
        it('should not throw with POST by default', done => {
            const app = createApp(function(ctx, next) {
                should.not.exist(ctx.request.body)
                ctx.status = 200
                return next()
            })

            request(app.listen())
                .post('/')
                .set('Content-Type', 'text/xml')
                .expect(200, done)
        })
    })
})
