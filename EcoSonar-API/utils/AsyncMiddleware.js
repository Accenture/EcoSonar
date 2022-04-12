// with promises, asyncrone function are necessary
function asyncMiddleware (fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
module.exports = asyncMiddleware
