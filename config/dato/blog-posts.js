/*  eslint-disable no-unused-vars */
const pick = require('./lib/pick')

module.exports = function blogPosts(postData, i18n, dato) {
  return pick(['title'], postData)
}
