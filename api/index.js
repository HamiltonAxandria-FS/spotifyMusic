const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/routes");
require("dotenv").config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Database Connection Error:", error);
});
db.once("open", () => {
  console.log("Database Connection Established");
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

