const { app } = require('./src/app')
const { db } = require('./db/connection')
const port = 3001

app.listen(port, () => {
  db.sync()
  console.log(`Listening at https://localhost:${port}`)
})
