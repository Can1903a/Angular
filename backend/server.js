const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "ecommerce"
});

//////LOGIN
app.post('/login', async (req, res) => {
  const sql = "SELECT * FROM musteriler WHERE Musteriler_Email = ? AND Musteriler_Sifre = ?";
  const values = [
    req.body.email,
    req.body.password
  ];

  try {
    const [data] = await db.query(sql, values);
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.status(401).json("Invalid email or password");
    }
  } catch (err) {
    console.error('Error during query:', err);
    return res.status(500).json("Login Failed");
  }
});
/////REGISTER
app.post('/register', async (req, res) => {
  const sql = "INSERT INTO musteriler (Musteriler_Adi, Musteriler_Soyadi, Musteriler_Tc, Musteriler_Sifre, Musteriler_Email, Musteriler_Telefon) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.name,
    req.body.surname,
    req.body.tc,
    req.body.password,
    req.body.email,
    req.body.tel
  ];

  try {
    const [data] = await db.query(sql, values);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Error during query:', err);
    return res.status(500).json({ message: "Registration Failed" });
  }
});


/////PRODUCTS

app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [results] = await db.query('SELECT * FROM urunler LIMIT ? OFFSET ?', [limit, offset]);
    const [totalResults] = await db.query('SELECT COUNT(*) AS total FROM urunler');
    const total = totalResults[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: results,
      page,
      totalPages,
      total
    });


  } catch (error) {
    return res.status(500).json({ error });
  }
});
  

app.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM kategoriler');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/uppercategories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM ustkategori');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching upper categories:', error);
    res.status(500).json({ error: 'Failed to fetch upper categories' });
  }
});


app.get('/subcategories/:ustKategoriId', async (req, res) => {
  const ustKategoriId = req.params.ustKategoriId; 
  try {
    const subcategories = await Category.find({ UstKategori_id: ustKategoriId });
    console.log('Alt Kategoriler:', subcategories); 
    console.log('ustKategoriId:', ustKategoriId); 
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

app.get('/products/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const [results] = await db.query('SELECT * FROM urunler WHERE Kategori_id = ?', [categoryId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


//

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
