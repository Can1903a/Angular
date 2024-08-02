const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    musteri_Id: { type: Schema.Types.ObjectId, ref: 'musteri'},
    yorum: { type: String },
    puan: { type: Number },
    urun_Id: { type: Schema.Types.ObjectId, ref: 'urun', required: true },
    yorum_Onay: {type: Boolean, required:true, default:false}
});

const Comment = mongoose.model('yorum', commentSchema);
module.exports = Comment;