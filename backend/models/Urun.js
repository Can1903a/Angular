const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urunSchema = new Schema({
    Urunler_Adi: { type: String, required: true },
    Urunler_Aciklama: { type: String },
    Urunler_Fiyat: { type: Number, required: true },
    Stok_Adet: { type: String },
    Kategori_id: { type: Schema.Types.ObjectId, ref: 'kategori', required: true },
    IndirimOrani: { type: Number, default: 0 },
    Marka_id: { type: Number ,required: false},
    Resim_URL: { type: String }
});

const Urun = mongoose.model('urun', urunSchema);
module.exports = Urun;