const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Database Connection Error:", error);
});
db.once("open", () => {
  console.log("Database Connection Established");
});

app.use("/auth", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
