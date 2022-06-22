require('dotenv-safe').config()

const port = process.env.APP_PORT || 4000
const app = require('./src')

app.listen(port, () => console.log('APP listening on port:', port))
