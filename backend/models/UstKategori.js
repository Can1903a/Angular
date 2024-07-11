const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ustKategoriSchema = new Schema({
    UstKategori_Adi: { type: String, required: true }
});

const UpperCategory = mongoose.model('ustKategori', ustKategoriSchema);
module.exports = UpperCategory;
