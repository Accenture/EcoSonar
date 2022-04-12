window.baseUrl = '';

window.t = (window.tp = function() {
  const args = Array.prototype.slice.call(arguments, 0);
  return args.join('.');
});
