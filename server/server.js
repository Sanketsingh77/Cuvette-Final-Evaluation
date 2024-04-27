const express = require("express");
require("dotenv").config();
const db = require("./utils/_db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const authRouter = require("./routes/AuthRoute");
const cardRouter = require("./routes/storyRouter");
app.use(express.json());
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST,PATCH,DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/stories", cardRouter);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
