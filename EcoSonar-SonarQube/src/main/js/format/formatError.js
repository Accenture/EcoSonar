export default function formatError (error, projectName, urlName) {
  error = error.replace('{0}', projectName)
  if (urlName) { error = error.replace('{1}', urlName) }
  return error
}
