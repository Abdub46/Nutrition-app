const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Horizon API Running 🚀" });
});

const PORT = process.env.PORT || 5000;


/******************TEST***********************/
const sequelize = require("./config/database");

sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection error:", err));




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
