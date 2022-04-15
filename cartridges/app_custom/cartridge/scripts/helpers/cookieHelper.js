function getCookie(name) {
  var cookies = request.getHttpCookies();
  for (var i in cookies) {
    if (cookies[i].name === name) {
      return cookies[i];
    }
  }
  return false;
}

module.exports = {
  getCookie: getCookie,
};
