const mongoose = require('mongoose')

const EventSchemas = new mongoose.Schema({
  title: String,
  start: String,
  end: String,
  backgroundColor: String,
  id: Number
})

EventSchemas.static = {
  findById: (_id, cb) => {
    return this
      .findOne({_id})
      .exec(cb)
  },
  findAllUnFinshed: (cb) => {
    return this
      .find()
      .exec(cb)
  }
}

module.exports = mongoose.model('EventSchemas', EventSchemas)
