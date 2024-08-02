const dbURI = 'mongodb+srv://root:aIxK2SGhBmFOE3Mz@ecommerce.6bufi1n.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce'; 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UpperCategory = require('./models/ustKategori');
const Category = require('./models/kategori');
const Customer = require('./models/Musteri');
const Product = require('./models/urun');
const Comment = require('./models/Yorum');
const app = express();
const jwt = require('jsonwebtoken');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(dbURI
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admins only.' });
  }
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ Musteriler_Email: email, Musteriler_Sifre: password });
    if (customer) {
      const token = jwt.sign({ _id: customer._id, isAdmin: customer.isAdmin }, 'token', { expiresIn: '2h' });
      res.json({ token, customer });
    } else {
      res.status(401).json("Invalid email or password");
    }
  } catch (err) {
    console.error('Error during query:', err);
    res.status(500).json("Login Failed");
  }
});

app.post('/register', async (req, res) => {
  const { name, surname, tc, password, email, tel } = req.body;

  try {
    const customer = new Customer({
      Musteriler_Adi: name,
      Musteriler_Soyadi: surname,
      Musteriler_Tc: tc,
      Musteriler_Sifre: password,
      Musteriler_Email: email,
      Musteriler_Telefon: tel,
      isAdmin: false 
    });

    await customer.save();
    res.status(200).json({ message: "User registered successfully" }); //200
  } catch (err) {
    console.error('Error during query:', err);
    res.status(400).json({ message: "Registration Failed" }); //400
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
    const objectId = new mongoose.Types.ObjectId(ustKategoriId);
    const subcategories = await Category.find({ UstKategori_id: objectId });
    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

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


// Ürünleri getir
app.get('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Belirli bir ürünü getir
app.get('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


app.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});



app.post('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
  const { Urunler_Adi, Urunler_Aciklama, Urunler_Fiyat, Resim_URL, Kategori_id, Stok_Adet, IndirimOrani, Marka_id } = req.body;

  try {
    const newProduct = new Product({
      Urunler_Adi,
      Urunler_Aciklama,
      Urunler_Fiyat,
      Resim_URL,
      Kategori_id,
      Stok_Adet,
      IndirimOrani,
      Marka_id
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Ürün güncelle
app.put('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
  const productId = req.params.productId;
  const { Urunler_Adi, Urunler_Aciklama, Urunler_Fiyat, Stok_Adet, Resim_URL, Kategori_id, IndirimOrani, Marka_id } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      Urunler_Adi,
      Urunler_Aciklama,
      Urunler_Fiyat,
      Stok_Adet,
      Resim_URL,
      Kategori_id,
      IndirimOrani,
      Marka_id 
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});



app.delete('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/admin/users', async (req, res) => {
  try {
    const users = await Customer.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get ('/slider', async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get ('/randomProducts', async (req, res) => {
  try {
    const randomCategory = await Category.aggregate([{ $sample: { size: 1 } }]);
    if (randomCategory.length>0) {
      const categoryId = randomCategory[0]._id

      const products = await Product.aggregate([
        { $match: { Kategori_id: categoryId } },
        { $sample: { size: 5 } }
      ]);

      res.json(products);
    } else {
      res.status(400).json({ message: 'Category Not Found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/product/:productId/addComment', authenticate, async (req, res) => {
  const productId = req.params.productId;
  const { yorum, puan } = req.body;
  const userId = req.user.id;

  try {
    const newComment = new Comment({
      musteri_Id: userId,
      yorum,
      puan,
      urun_Id: productId,
      yorum_Onay: false
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment Success', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.get('/product/:productId/comments', async (req, res) => {
  const productId = req.params.productId;

  try {
    const comments = await Comment.find({ urun_Id: productId, yorum_Onay: true });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.put('/comment/:commentId/approve', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { yorum_Onay: true },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.delete('/comment/:commentId/delete', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Server'ı başlatma
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});