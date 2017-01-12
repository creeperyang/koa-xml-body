# koa-xml-body

[![Build Status](https://travis-ci.org/creeperyang/koa-xml-body.svg?branch=master)](https://travis-ci.org/creeperyang/koa-xml-body)
[![npm version](https://badge.fury.io/js/koa-xml-body.svg)](https://badge.fury.io/js/koa-xml-body)
[![Dependency Status](https://david-dm.org/creeperyang/koa-xml-body.svg)](https://david-dm.org/creeperyang/koa-xml-body)
[![download times](https://img.shields.io/npm/dm/koa-xml-body.svg)](https://www.npmjs.com/package/koa-xml-body)

> Parse xml request body for Koa

## Install

[![NPM](https://nodei.co/npm/koa-xml-body.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-xml-body/)

## Usage

```js
var koa = require('koa');
var xmlParser = require('koa-xml-body').default; // note the default

var app = koa();
app.use(xmlParser());

app.use(function *() {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be undefined
    this.body = this.request.body;
});
```

`koa-xml-body` will carefully check and set `this.request.body`, so it can **intergate** well with other body parsers such as `koa-bodyparser`:

```js
// ...
var bodyParser = require('koa-bodyparser');

// ...
app.use(xmlParser());
app.use(bodyParser());
```

**Note:**

The lib is written in `ES6+` and transpiled with `Babel@6.x`. You should use the lib either the way below:

- **Traditional**: `var xmlParser = require('koa-xml-body').default;`
- **`ES6+` with `Babel@6.x`**: `import xmlParser from 'koa-xml-body';`


## Options

- **encoding**: requested encoding. Default is `utf8`. If not set, the lib will retrive it from `content-type`(such as `content-type:application/xml;charset=gb2312`).
- **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `1mb`.
- **length**: length of the body. When `content-length` is found, it will be overwritten automatically.
- **onerror**: error handler. Default is a `noop` function. It means it will **eat** the error silently. You can config it to customize the response.
- **xmlOptions**: options will be passed to `xml2js`. Default is `{}`. See [`xml2js Options`](https://github.com/Leonidas-from-XIV/node-xml2js#options) for details.

```js
app.use(xmlParser({
    limit: 128,
    length: 200, // '1mb'|1024... If not sure about the effect, just leave it unspecified
    encoding: 'utf8', // lib will detect it from `content-type`
    onerror: (err, ctx) => {
        ctx.throw(err.status, err.message);
    }
}));
```


## Licences

[MIT](LICENSE)