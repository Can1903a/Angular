const dbURI = 'mongodb+srv://root:aIxK2SGhBmFOE3Mz@ecommerce.6bufi1n.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce'; 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UpperCategory = require('./models/ustKategori');
const Category = require('./models/kategori');
const Customer = require('./models/musteri');
const Product = require('./models/urun');
const app = express();
const jwt = require('jsonwebtoken');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(dbURI
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ Musteriler_Email: email, Musteriler_Sifre: password });
    if (customer) {
      const token = jwt.sign({ _id: customer._id }, 'token', { expiresIn: '1h' });
      res.json({ token, customer });
    } else {
      res.status(401).json("Invalid email or password");
    }
  } catch (err) {
    console.error('Error during query:', err);
    res.status(500).json("Login Failed");
  }
});



// REGISTER endpoint'i
app.post('/register', async (req, res) => {
  const { name, surname, tc, password, email, tel } = req.body;

  try {
    const customer = new Customer({
      Musteriler_Adi: name,
      Musteriler_Soyadi: surname,
      Musteriler_Tc: tc,
      Musteriler_Sifre: password,
      Musteriler_Email: email,
      Musteriler_Telefon: tel
    });

    await customer.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Error during query:', err);
    res.status(500).json({ message: "Registration Failed" });
  }
});

app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit).populate('Kategori_id');
    const count = await Product.countDocuments();
    const totalPages = Math.ceil(count / limit);

    res.json({
      data: products,
      page,
      totalPages,
      total: count
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
  
  // Kategorileri getir
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Üst kategorileri getir
app.get('/uppercategories', async (req, res) => {
  try {
    const upperCategories = await UpperCategory.find();
    res.json(upperCategories);
  } catch (error) {
    console.error('Error fetching upper categories:', error);
    res.status(500).json({ error: 'Failed to fetch upper categories' });
  }
});
// Alt kategorileri getir
app.get('/subcategories/:ustKategoriId', async (req, res) => {
  const { ustKategoriId } = req.params;
  if (!ustKategoriId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  try {
    // ObjectId'yi doğru şekilde oluşturun
    const objectId = new mongoose.Types.ObjectId(ustKategoriId);
    const subcategories = await Category.find({ UstKategori_id: objectId });
    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Belirli bir kategoriye ait ürünleri getir
app.get('/products/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ Kategori_id: categoryId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  jwt.verify(token.split(' ')[1], 'token', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });

    req.user = decoded;
    next();
  });
};

app.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Customer.findById(userId).select('-Musteriler_Sifre');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil alınamadı', error });
  }
});


app.post('/profile/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (user.Musteriler_Sifre !== currentPassword) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }

    user.Musteriler_Sifre = newPassword;
    await user.save();

    res.json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Şifre değiştirilemedi', error });
  }
});
  
  // Server'ı başlatma
  app.listen(3000, () => {
      console.log('Server is running on port 3000');
  });
