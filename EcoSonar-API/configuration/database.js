const mongoose = require('mongoose')
const { retrievePassword } = require('./retrieveDatabasePasswordFromCloudProvider')

mongoose.set('strictQuery', false)

class Database {
}
Database.prototype.connection = async function () {
  let connectionString
  let user
  let password
  let dbName
  let cluster
  const mongoDBType = process.env.ECOSONAR_ENV_DB_TYPE || ''
  if (mongoDBType === 'MongoDB') {
    // connection to local dataBase MongoDB for MongoDB API
    cluster = process.env.ECOSONAR_ENV_CLUSTER || ''
    const port = process.env.ECOSONAR_ENV_DB_PORT || 27017
    dbName = process.env.ECOSONAR_ENV_DB_NAME || ''
    connectionString = `mongodb://${cluster}:${port}/${dbName}`
    mongoose.connect(connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log('Connection to MongoDB successful'))
      .catch((reason) => console.error('\x1b[31m%s\x1b[0m', 'Unable to connect to the mongodb instance. Error: ', reason))
  } else if (mongoDBType === 'MongoDB_Atlas') {
    // connection to dataBase MongoDB Atlas for MongoDB API
    user = process.env.ECOSONAR_ENV_USER || ''
    password = await retrievePassword()
    cluster = process.env.ECOSONAR_ENV_CLUSTER || ''
    dbName = process.env.ECOSONAR_ENV_DB_NAME || ''
    connectionString = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`
    mongoose.connect(connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log('Connection to MongoDB Atlas successful'))
      .catch((reason) => console.error('\x1b[31m%s\x1b[0m', 'Unable to connect to the mongodb instance. Error: ', reason))
  } else if (mongoDBType === 'CosmosDB') {
    // connection to dataBase Azure CosmosDB for MongoDB API
    cluster = process.env.ECOSONAR_ENV_CLUSTER || ''
    const port = process.env.ECOSONAR_ENV_DB_PORT || 0
    dbName = process.env.ECOSONAR_ENV_DB_NAME || ''
    user = process.env.ECOSONAR_ENV_USER || ''
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
  } else {
    console.log('Could not connect to any database')
  }
}

const database = new Database()
module.exports = database
