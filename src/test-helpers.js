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

function get(url) {
  return fetch(url)
    .then(checkStatus)
    .then(parseJSON);
}

function post(url, body) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(checkStatus)
    .then(parseJSON);
}

module.exports = {
  get,
  post
};
