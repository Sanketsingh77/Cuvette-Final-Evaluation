const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;
const options = {
  writeConcern: {
    w: "majority",
    j: true,
  },
};
mongoose.connect(URI, options);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to database successfully");
});
