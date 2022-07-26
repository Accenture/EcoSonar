const mongoose = require('mongoose')
const { retrievePassword } = require('./retrieveDatabasePasswordFromCloudProvider')

class DataBase {
}
DataBase.prototype.connection = async function () {
  let connectionString
  let user
  let password
  let dbName
  let cluster
  const environment = process.env.NODE_ENV || 'development'

  if (environment === 'development') {
    // connection to dataBase mongodb Atlas
    require('dotenv').config()
    user = process.env.USER || ''
    password = process.env.PASSWORD || ''
    cluster = process.env.CLUSTER || ''
    dbName = process.env.DB_NAME || ''
    connectionString = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`
    mongoose.connect(connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log('Connection to MongoDB Atlas successful'))
      .catch((reason) => console.error('\x1b[31m%s\x1b[0m', 'Unable to connect to the mongodb instance. Error: ', reason))
  } else {
    // connection to dataBase Azure CosmosDB for MongoDB API
    cluster = process.env.CLUSTER || ''
    const port = process.env.DB_PORT || 0
    dbName = process.env.DB_NAME || ''
    user = process.env.USER || ''
    password = await retrievePassword()
    connectionString = 'mongodb://' + cluster + ':' + port + '/' + dbName + '?ssl=true&replicaSet=globaldb'
    mongoose.connect(connectionString, {
      auth: {
        username: user,
        password
      },
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false
    })
      .then(() => console.log('Connection to CosmosDB successful'))
      .catch((err) => console.error('\x1b[31m%s\x1b[0m', err))
  }
}

const bdd = new DataBase()
module.exports = bdd
