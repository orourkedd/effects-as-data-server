function send(body, status, headers, cookies) {
  return {
    body,
    status: status || 200,
    headers,
    cookies: cookies || []
  };
}

function createCookie(name, value, options) {
  return [name, value, options];
}

module.exports = {
  send,
  createCookie
};
