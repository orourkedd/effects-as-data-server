function route(method, path, fn) {
  return [method, path, fn];
}

function routeGet(path, fn) {
  return route("get", path, fn);
}

function routePost(path, fn) {
  return route("post", path, fn);
}

function routePut(path, fn) {
  return route("put", path, fn);
}

function routePatch(path, fn) {
  return route("patch", path, fn);
}

function routeDelete(path, fn) {
  return route("delete", path, fn);
}

function routeHead(path, fn) {
  return route("head", path, fn);
}

function routeOptions(path, fn) {
  return route("options", path, fn);
}

module.exports = {
  get: routeGet,
  post: routePost,
  put: routePut,
  patch: routePatch,
  delete: routeDelete,
  head: routeHead,
  options: routeOptions
};
