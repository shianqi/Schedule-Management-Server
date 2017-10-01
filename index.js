const Koa = require('koa')
const path = require('path')
const app = new Koa()
const cors = require('koa2-cors')
const serve = require('koa-static')
const main = serve(path.join(__dirname, 'public'))

// Socket.io
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

app.use(cors({
  origin: (ctx) => {
    return ctx.request.header.origin
  }
}))
app.use(main)

app.use(ctx => {
  ctx.body = 'hello koa'
})

server.listen(3000, () => {
  console.log('listening on 3000')
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('message', (msg) => {
    console.log(msg)
  })
})
