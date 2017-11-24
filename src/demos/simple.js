const { init, cmds, send, router } = require("../index.js");

function* helloWorld() {
  const result = yield cmds.echo("hello world");
  return send(result);
}

const { start, stop } = init({
  port: 3000,
  routes: [router.get("/hello-world", helloWorld)]
});

// Start the server
start().catch(console.error);
