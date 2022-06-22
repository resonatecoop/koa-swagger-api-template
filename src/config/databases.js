import debug from 'debug'

const config = {
  development: {
    databases: {
      UserAPI: {
        username: process.env.POSTGRES_DB_USER,
        password: process.env.POSTGRES_DB_PASS,
        database: process.env.POSTGRES_DB_NAME,
        host: process.env.POSTGRES_DB_HOST,
        dialect: 'postgres',
        port: process.env.POSTGRES_DB_PORT || 5432,
        logging: debug('sequelize')
      }
    }
  },
  test: {
    databases: {
      UserAPI: {
        username: process.env.USER_API_DB_USER,
        password: process.env.USER_API_DB_PASS,
        database: process.env.USER_API_DB_NAME,
        host: process.env.USER_API_DB_HOST,
        dialect: 'postgres',
        port: process.env.USER_API_DB_PORT || 5432,
        logging: console.log
      }
    }
  },
  production: {
    databases: {
      UserAPI: {
        username: process.env.POSTGRES_DB_USER,
        password: process.env.POSTGRES_DB_PASS,
        database: process.env.POSTGRES_DB_NAME,
        host: process.env.POSTGRES_DB_HOST,
        dialect: 'postgres',
        port: process.env.POSTGRES_DB_PORT || 5432,
        logging: false
      }
    }
  }
}

export default config
