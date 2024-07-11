const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const kategoriSchema = new Schema({
    Kategori_Adi: { type: String },
    UstKategori_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ustKategori', required: true}
});

const Category = mongoose.model('kategori', kategoriSchema);
module.exports = Category;
