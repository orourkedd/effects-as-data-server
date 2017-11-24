function send(body, status, headers, cookies) {
  return {
    body,
    status,
    headers,
    cookies: cookies || []
  };
}

function notFound(body, headers, cookies) {
  return send(body || { message: "Not Found" }, 404, headers, cookies);
}

function notAuthorized(body, headers, cookies) {
  return send(body || { message: "Not Authorized" }, 401, headers, cookies);
}

function createCookie(name, value, options) {
  return [name, value, options];
}

module.exports = {
  send,
  notFound,
  notAuthorized,
  createCookie
};
