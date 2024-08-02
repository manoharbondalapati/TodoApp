const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const sessionRoutes = require('./routes/session');


const app = express();

const PORT = process.env.PORT || 8080;

mongoose
  .connect("mongodb://localhost:27017/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', todoRoutes);
app.use('/api', sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
