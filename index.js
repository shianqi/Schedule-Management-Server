const Koa = require('koa')
const path = require('path')
const app = new Koa()
const cors = require('koa2-cors')
const serve = require('koa-static')
const main = serve(path.join(__dirname, 'public'))

// Socket.io
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

// Mongodb
const mongoose = require('mongoose')

const index = require('./routes/index')
const users = require('./routes/users')
const Event = require('./models/Event')

mongoose.Promise = Promise
// connect mongodb
mongoose.connect('mongodb://localhost:27017/Schedule-Mangement', { useMongoClient: true })
mongoose.connection.on('error', console.error)

app.use(cors({
  origin: (ctx) => {
    return ctx.request.header.origin
  }
}))
app.use(main)

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

server.listen(3000, () => {
  console.log('listening on 3000')
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // 添加新事件
  socket.on('addEvent', (data) => {
    new Event({
      ...data
    }).save(() => {
      socket.emit('dataAddSuccess')
      socket.broadcast.emit('dataUpdate')
    })
  })

  // 删除某条事件
  socket.on('deleteEvent', async (_id) => {
    await Event.findByIdAndRemove(_id).catch(() => {
      io.emit('dataUpdate')
    })
    io.emit('dataUpdate')
  })

  // 修改某条事件
  socket.on('modifyEvent', async (data) => {
    await Event.findByIdAndUpdate(data._id, { $set: { ...data } }).catch(() => {
      io.emit('dataUpdate')
    })
    io.emit('dataUpdate')
  })

  // 改变大小
  socket.on('eventResize', async (data) => {
    const { _id, end } = data
    await Event.findByIdAndUpdate(_id, { $set: { end } }).catch(() => {
      io.emit('dataUpdate')
    })
    io.emit('dataUpdate')
  })

  // 拖动位置
  socket.on('eventDragStop', async (data) => {
    const { _id, end, start } = data
    console.log(data)
    await Event.findByIdAndUpdate(_id, { $set: { end, start } }).catch(() => {
      io.emit('dataUpdate')
    })
    io.emit('dataUpdate')
  })
})
