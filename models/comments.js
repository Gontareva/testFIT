let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema(
    {
        createdAt: { type: Date, default: Date.now , required: true},
        name: {type: String, required: true},
        email: {type:String},
        text: {type: String, required: true}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('comments', CommentSchema);
