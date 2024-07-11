const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musteriSchema = new Schema({
    Musteriler_Adi: { type: String, required: true },
    Musteriler_Soyadi: { type: String, required: true },
    Musteriler_Tc: { type: String, required: true },
    Musteriler_Sifre: { type: String, required: true },
    Musteriler_Email: { type: String },
    Musteriler_Telefon: { type: String }
});

const Musteri = mongoose.model('musteri', musteriSchema);
module.exports = Musteri;
