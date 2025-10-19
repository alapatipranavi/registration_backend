const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://alapatipranavi:081256@cluster0.whsx0bv.mongodb.net/registrationDB?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Route to handle registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, dob, gender, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, phone, dob, gender, password });
    await newUser.save();
    res.json({ message: "User Registered Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
