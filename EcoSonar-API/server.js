const http = require('http')
const app = require('./routes/app')
const database = require('./configuration/database')

// connection BDD
database.connection()

const normalizePort = val => {
  const portServer = parseInt(val, 10)

  if (isNaN(portServer)) {
    return val
  }
  if (portServer >= 0) {
    return portServer
  }
  return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error('\x1b[31m%s\x1b[0m', bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error('\x1b[31m%s\x1b[0m', bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

server.listen(port)
