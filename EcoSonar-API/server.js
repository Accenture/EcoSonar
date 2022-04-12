const http = require('http')
const app = require('./routes/app')
const bdd = require('./configuration/database')

// connection BDD
bdd.connection()

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
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
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
