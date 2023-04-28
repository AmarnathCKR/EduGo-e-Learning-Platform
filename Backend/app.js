require("./database/db");
const express = require("express");
const app = express();
const path = require("path");
const Instructor = require("./routes/Instructor");
const Student = require("./routes/Student")
const Admin = require("./routes/Admin")

const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Course } = require("./database/Course");

app.use(cookieParser());
app.use(
  session({
    name: "session",
    secret: "dgjdjdfjfjhhytjhd",
    duration: 30 * 60 * 1000,
    activeDuration: 50 * 60 * 1000,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
    resave : true
  })
);

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000","http://192.168.1.6:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);



app.use("/admin", Admin);
app.use("/instructor", Instructor);
app.use("/", Student);

require("dotenv").config();
const PORT = 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error starting server: " + err);
  } else {
    console.log("Listening on http://localhost:5000");
  }
});
