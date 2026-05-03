const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {mongoDB}=require("../backend/config/db.js");
const {User}=require("./models/user.model.js");
const app = express();
const dotenv=require("dotenv");
dotenv.config();
app.use(cors(
  {
    origin:"*"
  }
));
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/register', upload.single('photo'), async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone, city, uid, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, phone, city, uid, address,
      password: hashedPassword,
      photo: req.file ? req.file.filename : null
    });
    await user.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log(1);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ detail: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ detail: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login successful", token, userId: user._id });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});
app.get('/user/:id', async (req, res) => {
  try {
    console.log("get");
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ detail: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});
app.put('/user/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

app.post('/upload/data', (req, res) => {
  const { N, P, K, ph, temperature, humidity, rainfall } = req.body;

  let prediction = "Unknown";
  if (N > 80 && ph >= 6 && ph <= 7) {
    prediction = "Wheat";
  } else if (rainfall > 150 && humidity > 70) {
    prediction = "Rice";
  } else {
    prediction = "Maize";
  }

  res.json({ prediction });
});
app.post('/upload/image', upload.single('image'), (req, res) => {
  res.json({ prediction: "Healthy Plant", file: req.file.filename });
});


app.listen(process.env.PORT,()=>{
  mongoDB();
  console.log("Server running on port 8000");

});