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
  await Event.find({}, (err, _data) => {
    const data = _data.map((item) => {
      let backgroundColor = ''
      switch (item.emergencyLevel) {
        case 0:
          backgroundColor = '#fe4040'
          break
        case 1:
          backgroundColor = '#fab57c'
          break
        case 2:
          backgroundColor = '#5f99fd'
          break
        default:
          backgroundColor = '#97cd5e'
      }
      return {
        ...item._doc,
        backgroundColor
      }
    })
    if (!err) {
      ctx.body = data
    }
  })
})

module.exports = router
