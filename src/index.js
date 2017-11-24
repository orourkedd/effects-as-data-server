const { call } = require("effects-as-data");
const {
  handlers: universalHandlers,
  cmds
} = require("effects-as-data-universal");
const { send, notFound, notAuthorized } = require("./helpers");
const bodyParser = require("koa-bodyparser");
const cookie = require("koa-cookie").default;
const helmet = require("koa-helmet");
const isGeneratorFunction = require("is-generator-function");
const Koa = require("koa");
const koaRouter = require("koa-router");
const router = require("./router");

function init(options) {
  const app = new Koa();
  if (!options.disableHelmet) app.use(helmet(options.helmet));
  const router = koaRouter();
  if (!options.disableCookie) app.use(cookie(options.cookie));
  if (!options.disableBodyParser) app.use(bodyParser(options.bodyParser));

  // Combine handlers
  const handlers = Object.assign({}, universalHandlers, options.handlers || {});

  // Mount middleware
  if (options.middleware) (options.middleware || []).forEach(m => app.use(m));

  // Mount routes
  for (let route in options.routes) {
    const [method, path, fn] = options.routes[route];
    router[method](path, async ctx => {
      const { query, params, headers, cookie: cookies } = ctx;
      const { body } = ctx.request;
      const args = {
        query,
        params,
        body,
        headers,
        cookies: cookies || {},
        ctx
      };
      let result;
      if (isGeneratorFunction(fn)) {
        result = await call(options.config || {}, handlers, fn, args);
      } else {
        result = await fn(args);
      }

      // If the function interacted with the context directly, do no further processing
      if (ctx.body || ctx.status !== 404) return;

      // Force the function to return some kind of body
      if (result.body === undefined) {
        throw new Error(
          "`body` cannot be undefined.  Are you using the `send()` function?"
        );
      }

      ctx.status = result.status || 200;
      ctx.headers = result.headers || ctx.headers;
      // set cookies
      for (let i = 0; i < (result.cookies || []).length; i++) {
        const [name, value, options] = result.cookies[i];
        ctx.cookies.set(name, value, options);
      }
      ctx.body = result.body;
    });
  }

  app.use(router.routes()).use(router.allowedMethods());

  let serverInstance;

  const start = () => {
    return new Promise((resolve, reject) => {
      serverInstance = app.listen(options.port, (err, data) => {
        if (err) return reject(err);
        if (!options.test)
          console.log(`Server Listening on Port ${options.port}`);
        resolve();
      });
    });
  };

  let hasBeenStopped = false;
  const stop = () => {
    if (hasBeenStopped) return Promise.resolve();
    hasBeenStopped = true;
    return new Promise((resolve, reject) => {
      if (!serverInstance) return resolve();
      serverInstance.close(err => (err ? reject(err) : resolve()));
    });
  };

  return {
    start,
    stop
  };
}

module.exports = {
  cmds,
  init,
  notAuthorized,
  notFound,
  router,
  send
};
