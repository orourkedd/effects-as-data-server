const { call } = require("effects-as-data");
const { handlers: universalHandlers } = require("effects-as-data-universal");
const bodyParser = require("koa-bodyparser");
const cookie = require("koa-cookie").default;
const isGeneratorFunction = require("is-generator-function");
const Koa = require("koa");
const koaRouter = require("koa-router");
const router = require("./router");
const { send } = require("./helpers");

function init(options) {
  const app = new Koa();
  const router = koaRouter();
  app.use(cookie(options.cookie));
  app.use(bodyParser(options.bodyParser));

  // Combine handlers
  const handlers = Object.assign({}, universalHandlers, options.handlers || {});

  // Mount middleware
  if (options.middleware) options.middleware.forEach(m => app.use(m));

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
      if (ctx.body === undefined && ctx.status === 404) {
        ctx.status = result.status || 200;
        ctx.headers = result.headers || ctx.headers;
        // set cookies
        result.cookies.forEach(([name, value, options]) => {
          ctx.cookies.set(name, value, options);
        });
        ctx.body = result.body;
      }
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
  init,
  router,
  send
};
