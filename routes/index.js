const router = require('koa-router')()
const Event = require('../models/Event')

router.get('/', async (ctx, next) => {
  ctx.body = 'hello?'
})

router.get('/eventResize', async (ctx, next) => {
  const { _id, end } = ctx.query
  await Event.findByIdAndUpdate(_id, { $set: { end } }).catch(() => {
    ctx.body = { state: 0 }
  })
  ctx.body = { state: 1 }
})

router.get('/getData', async (ctx, next) => {
  await Event.find({}, (err, data) => {
    if (!err) {
      ctx.body = data
    }
  })
})

module.exports = router
