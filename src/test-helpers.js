const fetch = require("isomorphic-fetch");

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function get(url, options = {}) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

function post(url, body, options = {}) {
  return fetch(
    url,
    Object.assign(
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      },
      options
    )
  )
    .then(checkStatus)
    .then(parseJSON);
}

function put(url, body, options = {}) {
  return fetch(
    url,
    Object.assign(
      {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      },
      options
    )
  )
    .then(checkStatus)
    .then(parseJSON);
}

function patch(url, body, options = {}) {
  return fetch(
    url,
    Object.assign(
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      },
      options
    )
  )
    .then(checkStatus)
    .then(parseJSON);
}

function remove(url, options = {}) {
  return fetch(
    url,
    Object.assign(
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      },
      options
    )
  )
    .then(checkStatus)
    .then(parseJSON);
}

module.exports = {
  get,
  post,
  put,
  patch,
  remove
};
