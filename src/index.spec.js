const { init, router, send } = require("./index");
const { get, post, put, patch, remove } = require("./test-helpers");
const { cmds } = require("effects-as-data-universal");

test("it should handle a get request", async () => {
  function* testRoute({ query, params, body, headers, cookies }) {
    const message = yield cmds.echo("foo");
    return send({ query, params, body, headers, cookies, message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.get("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await get("http://localhost:3000/test/32?a=1&b=2", {
    headers: {
      Cookie: "foo=bar"
    }
  });
  await stop();

  expect(result.message).toEqual("foo");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({});
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});

test("it should handle a put request", async () => {
  function* testRoute({ query, params, body, headers, cookies }) {
    const message = yield cmds.echo("foo");
    return send({ query, params, body, headers, cookies, message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.put("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await put(
    "http://localhost:3000/test/32?a=1&b=2",
    { foo: "bar" },
    {
      headers: {
        Cookie: "foo=bar",
        "Content-Type": "application/json"
      }
    }
  );
  await stop();

  expect(result.message).toEqual("foo");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({ foo: "bar" });
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});

test("it should handle a patch request", async () => {
  function* testRoute({ query, params, body, headers, cookies }) {
    const message = yield cmds.echo("foo");
    return send({ query, params, body, headers, cookies, message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.patch("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await patch(
    "http://localhost:3000/test/32?a=1&b=2",
    { foo: "bar" },
    {
      headers: {
        Cookie: "foo=bar",
        "Content-Type": "application/json"
      }
    }
  );
  await stop();

  expect(result.message).toEqual("foo");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({ foo: "bar" });
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});

test("it should handle a post request", async () => {
  function* testRoute({ query, params, body, headers, cookies }) {
    const message = yield cmds.echo("foo");
    return send({ query, params, body, headers, cookies, message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.post("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await post(
    "http://localhost:3000/test/32?a=1&b=2",
    { foo: "bar" },
    {
      headers: {
        Cookie: "foo=bar",
        "Content-Type": "application/json"
      }
    }
  );
  await stop();

  expect(result.message).toEqual("foo");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({ foo: "bar" });
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});

test("it should handle a delete request", async () => {
  function* testRoute({ query, params, body, headers, cookies }) {
    const message = yield cmds.echo("foo");
    return send({ query, params, body, headers, cookies, message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.delete("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await remove("http://localhost:3000/test/32?a=1&b=2", {
    headers: {
      Cookie: "foo=bar"
    }
  });
  await stop();

  expect(result.message).toEqual("foo");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({});
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});

test("it should use a normal function which interacts directly with ctx", async () => {
  function* testRoute({ ctx, query, params, body, headers, cookies }) {
    ctx.body = { message: "foo bar", query, params, body, headers, cookies };
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.get("/test/:id", testRoute)],
    test: true
  });
  await start();
  const result = await get("http://localhost:3000/test/32?a=1&b=2", {
    headers: {
      Cookie: "foo=bar"
    }
  });
  await stop();
  expect(result.message).toEqual("foo bar");
  expect(result.query).toEqual({
    a: "1",
    b: "2"
  });
  expect(result.params).toEqual({ id: "32" });
  expect(result.body).toEqual({});
  expect(result.headers.host).toEqual("localhost:3000");
  expect(result.headers.cookie).toEqual("foo=bar");
  expect(result.cookies).toEqual({
    foo: "bar"
  });
});
