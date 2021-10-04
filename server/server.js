const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("./config/passport");
require("dotenv").config();

const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(morgan("dev"));

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/TemplateDB", {
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:5000");
});