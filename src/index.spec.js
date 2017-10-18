const { init, router, send } = require("./index");
const { get, post } = require("./test-helpers");
const { cmds } = require("effects-as-data-universal");

test("it should handle a get request", async () => {
  function* testRoute({ query, params, body }) {
    const message = yield cmds.echo("foo");
    return send({ message });
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.get("/test", testRoute)],
    test: true
  });
  await start();
  const result = await get("http://localhost:3000/test");
  await stop();
  expect(result).toEqual({ message: "foo" });
});

test("it should handle a post request", async () => {
  function* testRoute({ body }) {
    const result = yield cmds.echo(body);
    return send(result);
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.post("/test", testRoute)],
    test: true
  });
  await start();
  const result = await post("http://localhost:3000/test", { foo: "bar" });
  await stop();
  expect(result).toEqual({ foo: "bar" });
});

test("it should use a normal function which interacts directly with ctx", async () => {
  async function testRoute({ ctx }) {
    ctx.body = { message: "foo bar" };
  }
  const { start, stop } = init({
    port: 3000,
    routes: [router.get("/test", testRoute)],
    test: true
  });
  await start();
  const result = await get("http://localhost:3000/test");
  await stop();
  expect(result).toEqual({ message: "foo bar" });
});
