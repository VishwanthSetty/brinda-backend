const mongoose = require('mongoose')

const Schema = mongoose.Schema

classesSchema = new Schema({
    class:Number,
    subjects:[mongoose.Types.ObjectId],
})

module.exports = mongoose.model('classes',classSchema,'classes')