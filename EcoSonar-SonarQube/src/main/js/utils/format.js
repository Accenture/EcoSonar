// https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
export default function (format) {
  const args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined' ? args[number] : match
  })
}
