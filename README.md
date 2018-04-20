# Effects-as-data server

`effects-as-data-server` is a lightweight server built on Koa. It is designed for building web applications with effects-as-data.

The guiding principals behind the development of this server are:

1.  Routes should be functions that take JSON and return JSON, not functions that accept a `ctx` object and "return" by settings properties on that object.
2.  Routes should be easy to unit test thoroughly.
3.  Rapid development with `effects-as-data`. This means rapid development and clean code. In my experience, web servers have a way of turning into spaghetti quickly.
4.  Convention over configuration. Most of the time the default settings for this server will work for you and you can just focus on getting things done.

## Table of Contents

* [Installation](#installation)
* [Built-in Middleware](#built-in-middleware)
* [Usage](#usage)
* [Simple Example](#simple-example)
* [Using Custom EAD Interpreters](#using-custom-ead-interpreters)
* [Simple Example with non EAD function](#simple-example-with-non-ead-function)
* [Using Koa middleware](#using-koa-middleware)
* [API](#api)

## Installation

```
npm i effects-as-data-server
```

## Built-in Middleware

The following middleware is enabled by default. All, except `koa-router`, can be disabled. See [init](#initoptions) below.

* koa-helmet
* koa-cookie
* koa-bodyparser
* koa-router

## Usage

`effects-as-data-server` comes bundled with `effects-as-data-universal` by default.

### Simple Example

```js
const { init, cmds, send, router } = require("effects-as-data-server");

function* helloWorld({ body, query, params, headers, cookies }) {
  const result = yield cmds.echo("hello world");
  return send(result);
}

const { start, stop } = init({
  port: 3000,
  routes: [router.get("/hello-world", helloWorld)]
});

// Start the server
start().catch(console.error);
```

##### Unit test for Simple Example

```js
const { helloWorld } = require("./path/to/hello-world");
const { args, testFn } = require("effects-as-data/test");
const { cmds } = require("effects-as-data-server");

test(
  'helloWorld() should return "hello world"',
  testFn(helloWorld, () => {
    return args()
      .yieldCmd(cmds.echo("hello world"))
      .yieldReturns("hello world")
      .returns(send("hello world"));
  })
);
```

### Using Custom EAD Interpreters

```js
const { init } = require('effects-as-data-server');

function myCustomInterpreter () {
  return 'I always return this';
}

const { start, stop } = init({
  port: 3000,
  interpreters: {
    myCustomInterpreter
  },
  ...
});

// Start the server
start().catch(console.error);
```

### Simple Example with non EAD function

Just normal Koa.

```js
const { init, router } = require("effects-as-data-server");

// Just a normal koa middleware function
function helloWorld({ ctx, body, query, params, headers, cookies }) {
  ctx.body = "hello world";
}

const { start, stop } = init({
  port: 3000,
  routes: [router.get("/hello-world", helloWorld)]
});

// Start the server
start().catch(console.error);
```

### Using Koa middleware

The init function accepts an array of middleware functions.

```js
const { init, router } = require('effects-as-data-server');

// Just a normal koa middleware function
function customMiddleware (ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
}

const { start, stop } = init({
  port: 3000,
  middlware: [customMiddleware]
});

// Start the server
start().catch(console.error);
```

## API

The following functions are exported from `effects-as-data-server`.

#### init([options])

`init` is used to initialize a server.

* `options` <[Object]> Effects-as-data server options. Can have the following fields:
  * `routes` <[Array]> An array of routes created using the `router`.
  * `context` <[Object]> Effects-as-data context.
  * `helmet` <[Object]> Options to be passed to `koa-helmet`.
  * `disableHelmet` <[boolean]> Disable `koa-helmet` if `true`. Default is `false`.
  * `middleware` <[Array]> An array of Koa middleware.
  * `port` <[Number]> The port on which the server runs.
  * `cookie` <[Object]> Options to be passed to `koa-cookie`.
  * `disableCookie` <[Boolean]> Disable `koa-cookie` if `true`. Default is `false`.
  * `bodyParser` <[Object]> Options to be passed to `koa-bodyparser`.
  * `disableBodyParser` <[Boolean]> Disable `koa-bodyparser` if `true`. Default is `false`.
  * `test` <[Boolean]> If `true`, don't print startup messages to console. Default is `false`.

Returns: <Object> An object with a `start` and `stop` function used to start and stop the server, respectively.

#### send([body], [status], [headers], [cookies])

Create a response to be returned by an EAD function and sent to the client.

* `body` <[Any]> The response body. **required**
* `status` <[Number]> The response status. Ex: `200`, `204`, `400`, etc.
* `headers` <[Object]> An object of headers. Ex: `{ 'X-Response-Time': 32 }`
* `cookies` <[Array]> An array of cookies created using the `createCookie` function.

Returns: <Object> An object containing the response body, status, headers, and cookies.

#### notFound([body], [headers], [cookies])

Create a not found response to be returned by an EAD function and sent to the client. This is a convenience function that wraps `send`.

* `body` <[Any]> The response body. **required**
* `headers` <[Object]> An object of headers. Ex: `{ 'X-Response-Time': 32 }`
* `cookies` <[Array]> An array of cookies created using the `createCookie` function.

Returns: <Object> An object containing the response body, status of 404, headers, and cookies.

#### notAuthorized([body], [headers], [cookies])

Create a not authorized response to be returned by an EAD function and sent to the client. This is a convenience function that wraps `send`.

* `body` <[Any]> The response body. **required**
* `headers` <[Object]> An object of headers. Ex: `{ 'X-Response-Time': 32 }`
* `cookies` <[Array]> An array of cookies created using the `createCookie` function.

Returns: <Object> An object containing the response body, status of 401, headers, and cookies.

#### createCookie([name], [value], [options])

Create a cookie which, internall, will be set with Koa's `ctx.cookies.set`.

* `name` <[String]> Name of the cookie. **required**
* `value` <[String]> Value of the cookie. **required**
* `options` <[Object]> Options for Koa's `ctx.cookies.set` function which is used to set the cookie.

Returns: <Object> A cookie to be set.

#### Router

The router is exported from `effects-as-data-server`:

```js
const { router } = require('effects-as-data-server');

const { start, stop } = init({
  port: 3000,
  routes: [
    router.get('/api/users', function * () { ... })
    router.get('/api/users/:id', function * () { ... })
    router.post('/api/users', function * () { ... })
    router.put('/api/users/:id', function * () { ... })
  ],
  ...
});
```

##### router.get([path], [function])

* `path` <[String]> A string path for this route. Ex: `/api/users`
* `function` <[Function]> An EAD function or a Koa middleware function.

Returns: A route for the `routes` array passed to the `init` function.

##### router.post([path], [function])

* `path` <[String]> A string path for this route. Ex: `/api/users`
* `function` <[Function]> An EAD function or a Koa middleware function.

Returns: A route for the `routes` array passed to the `init` function.

##### router.put([path], [function])

* `path` <[String]> A string path for this route. Ex: `/api/users/32`
* `function` <[Function]> An EAD function or a Koa middleware function.

Returns: A route for the `routes` array passed to the `init` function.

##### router.patch([path], [function])

* `path` <[String]> A string path for this route. Ex: `/api/users/32`
* `function` <[Function]> An EAD function or a Koa middleware function.

Returns: A route for the `routes` array passed to the `init` function.

##### router.delete([path], [function])

* `path` <[String]> A string path for this route. Ex: `/api/users/32`
* `function` <[Function]> An EAD function or a Koa middleware function.

Returns: A route for the `routes` array passed to the `init` function.
