import fs from 'fs'
import path from 'path'
import sequelize, { Sequelize, DataTypes } from 'sequelize'

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '/../../config/databases'))[env]
const db = {}

const databases = Object.keys(config.databases)

for (let i = 0; i < databases.length; ++i) {
  const database = databases[i]
  const dbPath = config.databases[database]

  db[database] = new Sequelize(dbPath.database, dbPath.username, dbPath.password, dbPath)
}

fs
  .readdirSync(path.join(__dirname, './userapi'))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, '/userapi', file))(db.UserAPI, DataTypes)

    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export default db
