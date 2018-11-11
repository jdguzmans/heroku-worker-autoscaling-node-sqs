
require('dotenv').config()

const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const server = http.createServer(app)
server.listen(process.env.PORT)
server.on('listening', () => {
  console.log(`web server is running on port ${process.env.PORT}\n`)
})

const queueMessage = () => {
  return new Promise((resolve, reject) => {
    const params = {
      MessageBody: 'test',
      QueueUrl: process.env.AWS_QUEUE_URL,
      MessageAttributes: {
        'attr1': {
          DataType: 'String',
          StringValue: 'attr1Value'
        }
      }
    }

    sqs.sendMessage(params, (err, data) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

const router = express.Router()

router.get('/', async (req, res, next) => {
  for (let i = 0; i < 1; i++) {
    await queueMessage()
  }
  res.sendStatus(200)
})

app.use('/', router)
