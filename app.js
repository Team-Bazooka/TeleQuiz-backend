const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const router = require('./routes/routes')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('TeleQuiz running!')
})

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use("/api", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})