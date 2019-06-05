# koa-xml-body

[![Build Status](https://travis-ci.org/creeperyang/koa-xml-body.svg?branch=master)](https://travis-ci.org/creeperyang/koa-xml-body)
[![npm version](https://badge.fury.io/js/koa-xml-body.svg)](https://badge.fury.io/js/koa-xml-body)
[![Dependency Status](https://david-dm.org/creeperyang/koa-xml-body.svg)](https://david-dm.org/creeperyang/koa-xml-body)
[![download times](https://img.shields.io/npm/dm/koa-xml-body.svg)](https://www.npmjs.com/package/koa-xml-body)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcreeperyang%2Fkoa-xml-body.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcreeperyang%2Fkoa-xml-body?ref=badge_shield)

> Parse xml request body for Koa

## Install

[![NPM](https://nodei.co/npm/koa-xml-body.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-xml-body/)

## Usage

```js
const koa = require('koa')
const xmlParser = require('koa-xml-body')

const app = koa()
app.use(xmlParser())

app.use(function(ctx, next) {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be undefined
    ctx.body = ctx.request.body
    return next()
})
```

`koa-xml-body` will carefully check and set `context.request.body`, so it can **intergate** well with other body parsers such as `koa-bodyparser`:

```js
// ...
const bodyParser = require('koa-bodyparser')

// ...
app.use(xmlParser())
app.use(bodyParser())
```

**Note:**

Current version (`v2.x`) of `koa-xml-body` is writtern with `ES2015` and for `koa@2`. If you use `koa@1.x`, use `koa-xml-body@1.x` instead.


## Options

- **encoding**: requested encoding. Default is `utf8`. If not set, the lib will retrive it from `content-type`(such as `content-type:application/xml;charset=gb2312`).
- **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `1mb`.
- **length**: length of the body. When `content-length` is found, it will be overwritten automatically.
- **onerror**: error handler. Default is a `noop` function. It means it will **eat** the error silently. You can config it to customize the response.
- **xmlOptions**: options which will be used to parse xml. Default is `{}`. See [`xml2js Options`](https://github.com/Leonidas-from-XIV/node-xml2js#options) for details.
- **key**: A chance to redefine what the property name to use instead of the default `body (ctx.request.body)`.

```js
app.use(xmlParser({
    limit: 128,
    encoding: 'utf8', // lib will detect it from `content-type`
    xmlOptions: {
        explicitArray: false
    },
    key: 'xmlBody', // lib will check ctx.request.xmlBody & set parsed data to it.
    onerror: (err, ctx) => {
        ctx.throw(err.status, err.message);
    }
}))
```

## Licences

[MIT](LICENSE)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcreeperyang%2Fkoa-xml-body.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcreeperyang%2Fkoa-xml-body?ref=badge_large)